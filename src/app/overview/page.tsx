import { Title } from "@/components/ui/typography";

export default function Page() {
  return (
    <div className="flex flex-wrap items-start gap-12 max-w-6xl w-full ml-8">
      <div>
        <Title>Create characters</Title>
        <img
          src="gifs/create_character.gif"
          alt="character creation"
          width="450px"
        />
      </div>
      <div>
        <Title>Create games</Title>
        <img src="gifs/create_game.gif" alt="game creation" width="450px" />
      </div>
      <div>
        <Title>Share the table id to invite players</Title>
        <img src="gifs/share_link.gif" alt="share link" width="450px" />
      </div>
      <div>
        <Title>Join a game with a table id</Title>
        <img src="gifs/join_game.gif" alt="join game" width="450px" />
      </div>
      <div>
        <Title>Roll attribute checks</Title>
        <img src="gifs/attribute_check.gif" alt="share link" width="450px" />
      </div>
      <div>
        <Title>Dice results are shared</Title>
        <img src="gifs/dice_result.gif" alt="join game" width="450px" />
      </div>
      <div>
        <Title>Manage inventory</Title>
        <img src="gifs/manage_inventory.gif" alt="share link" width="450px" />
      </div>
      <div>
        <Title>Manage hirelings & carts</Title>
        <img src="gifs/manage_hirelings.gif" alt="join game" width="450px" />
      </div>
      <div>
        <Title>Create and share game content</Title>
        <img src="gifs/create_game_content.gif" alt="share link" width="450px" />
      </div>
      <div>
        <Title>React to shared content and damages</Title>
        <img src="gifs/react_to_content.gif" alt="join game" width="450px" />
      </div>
    </div>
  );
}
