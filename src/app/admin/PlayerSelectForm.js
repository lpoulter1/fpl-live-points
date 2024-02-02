"use client";

export function PlayerSelectForm({ items, updateDrafters }) {
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    console.log(e.target.drafter.value);
    console.log(e.target.player.value);
    await updateDrafters();
  };
  return (
    <form onSubmit={handleOnSubmit}>
      <select name="drafter">
        <option value="laurie">Laurie</option>
        <option value="james">James</option>
      </select>
      <select name="player">
        {items.map((player) => {
          return (
            <option key={player.id} value={player}>
              {player.name}
            </option>
          );
        })}
      </select>

      <button type="submit">Submit</button>
    </form>
  );
}
