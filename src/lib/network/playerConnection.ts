import { useEffect, useRef, useState } from "react";
import { useBrowserId } from "../hooks";
import {
  AllChatMessage,
  AllSyncMessageForGM,
  AnyMessage,
  ConnectionMetadata,
  Stamped,
  UknownGameMessage,
} from "./types";
import Peer, { DataConnection } from "peerjs";
import { stamp, useLog } from "./utils";
import { BaseCharacter, LibraryElement } from "../game/types";

type ConnectionStatus =
  | "connecting"
  | "connected"
  | "error"
  | "disconnected"
  | "offline";

export function usePlayerConnection<
  TChar extends BaseCharacter,
  TMessage extends UknownGameMessage
>(sessionCode: string, character: TChar) {
  const browserId = useBrowserId();
  const [messages, setMessages] = useState<Stamped<AllChatMessage<TMessage>>[]>(
    []
  );
  const [revealedElements, setRevealedElements] = useState<LibraryElement[]>(
    []
  );
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connecting");
  const debounceRef = useRef(false);
  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  const stub = useLog(character.name, character.id);

  function initialize() {
    // Create own peer object with connection to shared PeerJS server
    let peer = new Peer();

    peerRef.current = peer;

    peer.on("open", function (id) {
      console.log("peer connected with id: " + id);
    });
    peer.on("connection", function (c) {
      // Disallow incoming connections
      c.on("open", function () {
        c.send("Sender does not accept incoming connections");
        setTimeout(function () {
          c.close();
        }, 500);
      });
    });
    peer.on("disconnected", function () {
      console.log("Connection lost. Please reconnect");
      setConnectionStatus("disconnected");
      peer.reconnect();
    });
    peer.on("close", function () {
      peerRef.current = null;
      setConnectionStatus("disconnected");
      console.log("Peer destroyed. Please refresh");
    });
    peer.on("error", function (err) {
      setConnectionStatus("error");
      console.log(err);
    });
  }

  function join(serverId: string) {
    // Close old connection
    if (connRef.current) {
      console.log("closing previous connection");
      setConnectionStatus("disconnected");
      connRef.current.close();
    }

    // Create connection to destination peer specified in the input field
    const metadata: ConnectionMetadata = { browserId };
    let conn = peerRef.current!.connect(serverId, {
      reliable: true,
      metadata,
    });
    connRef.current = conn;

    conn.on("open", function () {
      console.log("Connected to: " + conn.peer);

      log({
        type: "SimpleMessage",
        props: { content: `${character.name} joined the session` },
        transient: true,
      });

      setConnectionStatus("connected");
      syncLog({ type: "UpdateChar", props: { character } });
      syncLog({ type: "MessageHistoryRequest", props: {} });
      syncLog({ type: "RevealedElementsRequest", props: {} });
    });
    // Handle incoming data (messages only since this is the signal sender)
    conn.on("data", function (data) {
      console.debug("data received", data);
      const typeData = data as AnyMessage<TChar, TMessage>;
      if (typeData.kind === "sync") {
        if (typeData.destination === "GM") {
          return;
        }
        if (typeData.type === "MessageHistoryResponse") {
          setMessages(typeData.props.messages);
          return;
        }
        if (typeData.type === "RevealedElementsResponse") {
          setRevealedElements(typeData.props.revealedElements);
          return;
        }
      } else if (typeData.kind === "chat") {
        setMessages((m) => [...m, typeData]);
        return;
      }
    });
    conn.on("close", function () {
      console.log("Connection closed");
      setConnectionStatus("disconnected");
      connRef.current = null;
    });
    conn.on("error", (e) => {
      setConnectionStatus("error");
      console.error("connexion error", e);
    });
  }

  function send(m: AnyMessage<TChar, TMessage>) {
    if (connRef.current) {
      connRef.current.send(m);
    }
  }

  function log(m: AllChatMessage<TMessage>) {
    send({ kind: "chat", ...stamp(character, m) });
  }

  function syncLog(m: AllSyncMessageForGM<TChar>) {
    send({ kind: "sync", destination: "GM", ...m });
  }

  useEffect(() => {
    if (!sessionCode) {
      setConnectionStatus("offline");
      return;
    }
    if (debounceRef.current) {
      return;
    }
    debounceRef.current = true;
    initialize();
    setTimeout(() => join(sessionCode), 1000);
  }, []);

  useEffect(() => {
    syncLog({
      type: "UpdateChar",
      props: { character },
    });
  }, [character]);

  return !!sessionCode
    ? { log, messages, connectionStatus, revealedElements }
    : {
        log: stub.log,
        messages: stub.messages,
        connectionStatus,
        revealedElements,
      };
}
