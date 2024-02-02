"use client";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

export function Dropdown({ items }) {
  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    console.log(string, results);
  };
  const handleOnSelect = (item) => {
    // the item selected
    console.log(item);
  };
  const formatResult = (item) => {
    return (
      <>
        <span style={{ display: "block", textAlign: "left" }}>{item.name}</span>
      </>
    );
  };
  return (
    <ReactSearchAutocomplete
      items={items}
      onSearch={handleOnSearch}
      // onHover={handleOnHover}
      onSelect={handleOnSelect}
      // onFocus={handleOnFocus}
      // autoFocus
      formatResult={formatResult}
    />
  );
}
