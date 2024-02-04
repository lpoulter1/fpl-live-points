"use client";
import { useRouter } from "next/navigation";

export function PlayerSelectForm({ items, updateDrafters }) {
  const router = useRouter();
  const handleOnSubmit = async (e) => {
    // e.preventDefault();
    const player = items.find(
      (item) => item.id === parseInt(e.target.player.value)
    );

    await updateDrafters({
      drafter: e.target.drafter.value,
      player,
    });

    router.reload();
  };
  return (
    <form onSubmit={handleOnSubmit}>
      <select name="drafter" className="text-gray-800">
        <option value="laurie">Laurie</option>
        <option value="james">James</option>
      </select>
      <select name="player" className="text-gray-800">
        {items.map((player) => {
          return (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          );
        })}
      </select>

      <button type="submit">Submit</button>
    </form>
  );
}
