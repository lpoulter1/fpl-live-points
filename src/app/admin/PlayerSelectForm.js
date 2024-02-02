"use client";
import { Dropdown } from "./Dropdown";

export function PlayerSelectForm({ items }) {
  const handleOnSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.drafter.value);
    console.log(e.target.player.value);
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
