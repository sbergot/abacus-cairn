import { useEffect, useRef, useState } from "react";
import {
  AllChatMessage,
  AllSyncMessageForPlayer,
  AnyMessage,
  ConnectionMetadata,
  Logger,
  Stamped,
  UknownGameMessage,
} from "./types";
import Peer, { DataConnection } from "peerjs";
import { stamp } from "./utils";
import { BaseCharacter, BaseGame, LibraryElement } from "../game/types";
import { useCurrentGenericGame } from "../gameContext";

type ConnectionState = "connected" | "closed" | "error";

const MAX_MESSAGE_NBR = 500;

interface ConnectionInfo<TChar> {
  id: string;
  character: TChar | null;
  state: ConnectionState;
}

export interface GmConnection<TMessage, TGame, TChar> extends Logger<TMessage> {
  sessionCode: string;
  messages: Stamped<AllChatMessage<TMessage>>[];
  updateRevealedElements(g: TGame): void;
  connections: ConnectionInfo<TChar>[];
}

function rotateArray<T>(arr: T[], limit: number): T[] {
  return arr.slice(Math.max(arr.length - limit, 0));
}

export function useGmConnection<
  TChar extends BaseCharacter,
  TMessage extends UknownGameMessage,
  TGame extends BaseGame<TMessage>
>(getAllRevealedElements: (g: TGame) => LibraryElement[]): GmConnection<TMessage, TGame, TChar> {
  const { state: game, setState: setGame } = useCurrentGenericGame();
  const [sessionCode, setSessionCode] = useState("");
  const [connectionsState, setConnectionsState] = useState<
    Record<string, ConnectionInfo<TChar>>
  >({});
  const { messages } = game;
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const revealedElements = getAllRevealedElements(game as TGame);
  const revealedElementsRef = useRef(revealedElements);
  revealedElementsRef.current = revealedElements;
  const debounceRef = useRef(false);
  const playerConnectionsRef = useRef<Record<string, DataConnection>>({});
  const [transientMessages, setTransientMessages] =
    useState<Stamped<AllChatMessage<TMessage>>[]>(messages);

  function initialize() {
    if (debounceRef.current) {
      return;
    }
    debounceRef.current = true;
    const peer = new Peer();
    playerConnectionsRef.current = {};
    setConnectionsState({});

    peer.on("open", function (id) {
      console.log("peer connected with id: " + id);
      setSessionCode(id);
    });

    peer.on("connection", function (c) {
      console.log("Peer connected");
      ready(c);
    });
    peer.on("disconnected", function () {
      console.log("Connection lost. Please reconnect");
    });
    peer.on("close", function () {
      console.log("Peer destroyed");
      playerConnectionsRef.current = {};
      setConnectionsState({});
    });
    peer.on("error", function (err) {
      console.log(err);
    });
    function ready(conn: DataConnection) {
      const metadata: ConnectionMetadata = conn.metadata;
      playerConnectionsRef.current[metadata.browserId] = conn;
      setConnectionsState((cs) => ({
        ...cs,
        [metadata.browserId]: {
          character: null,
          id: metadata.browserId,
          state: "connected",
        },
      }));

      conn.on("data", function (data) {
        console.debug("Data received", data);
        const typeData = data as AnyMessage<TChar, TMessage>;

        if (typeData.kind === "sync" && typeData.destination === "GM") {
          if (typeData.type === "UpdateChar") {
            const newChar = typeData.props.character;
            setConnectionsState((cs) => ({
              ...cs,
              [metadata.browserId]: {
                character: newChar,
                id: metadata.browserId,
                state: "connected",
              },
            }));
            return;
          }
          if (typeData.type === "MessageHistoryRequest") {
            const response: AllSyncMessageForPlayer<TMessage> = {
              type: "MessageHistoryResponse",
              props: {
                messages: messagesRef.current.filter((m) => !m.gmOnly),
              },
            };
            conn.send(response);
            return;
          }
          if (typeData.type === "RevealedElementsRequest") {
            const response: AllSyncMessageForPlayer<TMessage> = {
              type: "RevealedElementsResponse",
              props: { revealedElements: revealedElementsRef.current },
            };
            conn.send(response);
            return;
          }
        } else if (
          typeData.kind === "chat-common" ||
          typeData.kind === "chat-custom"
        ) {
          storeAndSendAll(typeData);
        }
      });

      conn.on("close", function () {
        console.log("Connection destroyed");
        delete playerConnectionsRef.current[metadata.browserId];
        setConnectionsState((cs) => ({
          ...cs,
          [metadata.browserId]: {
            character: null,
            id: metadata.browserId,
            state: "closed",
          },
        }));
      });

      conn.on("error", (e) => {
        console.error("connexion error", e);
        setConnectionsState((cs) => ({
          ...cs,
          [metadata.browserId]: {
            ...cs[metadata.browserId],
            state: "error",
          },
        }));
      });
    }
  }

  function sendAll(m: AnyMessage<TChar, TMessage>) {
    if (playerConnectionsRef.current) {
      Object.values(playerConnectionsRef.current).forEach((c) => {
        c.send(m);
      });
    }
  }

  function sendAllSync(m: AllSyncMessageForPlayer<TMessage>) {
    sendAll({ kind: "sync", destination: "Player", ...m });
  }

  function storeAndSendAll(stamped: Stamped<AllChatMessage<TMessage>>) {
    if (!stamped.transient) {
      setGame((d) => {
        d.messages.push(stamped);
      });
    }
    setTransientMessages((tms) =>
      rotateArray([...tms, stamped], MAX_MESSAGE_NBR)
    );
    if (!stamped.gmOnly) {
      sendAll(stamped);
    }
  }

  function log(m: AllChatMessage<TMessage>) {
    const stamped = stamp({ id: "gm", name: "gm" }, m);
    storeAndSendAll(stamped);
  }

  function updateRevealedElements(c: TGame) {
    const response: AllSyncMessageForPlayer<TMessage> = {
      type: "RevealedElementsResponse",
      props: { revealedElements: getAllRevealedElements(c) },
    };
    sendAllSync(response);
  }

  useEffect(() => {
    initialize();
  }, []);

  return {
    sessionCode,
    connections: Object.values(connectionsState),
    log,
    updateRevealedElements,
    messages: transientMessages,
  };
}
