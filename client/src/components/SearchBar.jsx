import React, { useState, useEffect, useCallback } from "react";

import useDelay from "../hooks/useDelay";

export default function SearchBar(props) {
  const [value, setValue] = useState("");
  const term = useDelay(value, 2000);

  const onSearch = useCallback(props.onSearch, [term]);

  useEffect(() => {
    onSearch(term);
  }, [term, onSearch]);

  return (
    <section className="search">
      <form
        className="search__form"
        onSubmit={(event) => event.preventDefault()}
      >
        <input
          placeholder="Search Movies"
          name="search"
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </form>
    </section>
  );
}
