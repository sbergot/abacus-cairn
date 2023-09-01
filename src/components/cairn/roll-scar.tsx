import { useLoggerContext } from "@/app/cairn-context";
import { Button } from "../ui/button";
import { pickRandom } from "@/lib/random";
import { scars } from "@/lib/game/cairn/other-data";

export function RollScar() {
    const log = useLoggerContext();
    return <Button onClick={() => log({
        kind: "chat-common",
        type: "BasicMessage",
        props: {
            content: pickRandom(scars)
        }
    })}>Roll</Button>
}