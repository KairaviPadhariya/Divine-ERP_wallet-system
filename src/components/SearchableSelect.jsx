import React, { useState, useEffect, useRef } from "react";
import "../styles/dashboard.css"; // Ensure it uses the same styles

const SearchableSelect = ({ options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Find selected option label
    const selectedOption = options.find((opt) => opt.value === value);

    // Filter options based on search term
    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm("");
    };

    return (
        <div className="searchable-select" ref={dropdownRef}>
            <div
                className="select-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption ? selectedOption.label : placeholder || "Select..."}
                <span className="arrow">▼</span>
            </div>

            {isOpen && (
                <div className="select-dropdown">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Type to search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                    <ul className="options-list">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <li
                                    key={opt.value}
                                    onClick={() => handleSelect(opt.value)}
                                    className={opt.value === value ? "selected" : ""}
                                >
                                    {opt.label}
                                </li>
                            ))
                        ) : (
                            <li className="no-options">No results found</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
