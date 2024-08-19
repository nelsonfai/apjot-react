import React, { useState } from "react";

function FilterSection({ handleFilter, getAll, search }) {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filterOptions = [
    { value: null, label: "All" },
    { value: "plr", label: "Philosophy and life reflections" },
    { value: "pdg", label: "Personal development and growth" },
    { value: "scc", label: "Social and Cultural commentary" },
    //{ value: "ins", label: "Inspirational stories" },
    {value:"bbr",label:"Biblical Reflections"},

    { value: "mwb", label: "Mindfulness and Well being" },
    { value: "bks", label: "Book Reviews" },
  ];

  const handleCheckboxChange = (value) => {
    setSelectedFilter(value === selectedFilter ? null : value);
    if (value) {
      handleFilter(value);
    } else getAll();
  };
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSelectedFilter(".");
    search(searchQuery);
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "1rem auto", padding: "1rem" }}>
      <form
        onSubmit={handleSearchSubmit}
        style={{
          display: "flex",
        }}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInputChange}
          placeholder="Search..."
          style={{
            borderTopLeftRadius: "14px",
            borderBottomLeftRadius: "14px",
            padding: "12px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            borderTopRightRadius: "14px",
            borderBottomRightRadius: "14px",
            maxWidth: "90px",
            padding: "12px",
            backgroundColor: "#E9E9E9",
            border: "1px solid #d3d3d3",
            color: "black",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>
      <div className="filter-container">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            width: "100%",
          }}
        >
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleCheckboxChange(option.value)}
              className={selectedFilter === option.value ? "active" : ""}
              style={{
                border: "none",
                padding: "7px 12px",
                backgroundColor: "whitesmoke",
                cursor: "pointer",
                borderRadius: "8px",
                whiteSpace: "nowrap",
                outline: "none",
                color: "black",
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterSection;
