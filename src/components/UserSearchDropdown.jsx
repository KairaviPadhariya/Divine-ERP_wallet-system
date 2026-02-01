import React, { useState, useEffect, useRef } from 'react';
import "../styles/dashboard.css"; // Reuse existing styles or add new ones

const UserSearchDropdown = ({ users, selectedUserId, onSelectUser, placeholder = "Select User" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const wrapperRef = useRef(null);

    // Find selected user name for display
    const selectedUser = users.find(u => u.id === selectedUserId);
    const displayValue = selectedUser ? (selectedUser.username || selectedUser.email) : "";

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    // Filter users
    const filteredUsers = users.filter(user => {
        const username = (user.username || "").toLowerCase();
        const term = searchTerm.toLowerCase();
        return username.includes(term);
    });

    const handleSelect = (userId) => {
        onSelectUser(userId);
        setIsOpen(false);
        setSearchTerm("");
    };

    return (
        <div className="user-search-dropdown" ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
            {/* Input / Trigger */}
            <div
                className="dropdown-trigger"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    border: '1px solid #cbd5e1',
                    padding: '10px',
                    borderRadius: '6px',
                    cursor: 'text',
                    backgroundColor: '#fff',
                    minHeight: '42px',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {isOpen ? (
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search or select username"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            border: 'none',
                            outline: 'none',
                            width: '100%',
                            padding: 0,
                            margin: 0,
                            fontSize: '14px'
                        }}
                    />
                ) : (
                    <span style={{ color: selectedUserId ? '#000' : '#555', fontSize: '14px' }}>
                        {displayValue || placeholder}
                    </span>
                )}
            </div>

            {/* Dropdown List */}
            {isOpen && (
                <ul className="dropdown-options" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    backgroundColor: '#fff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    marginTop: '4px',
                    padding: 0,
                    listStyle: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <li
                                key={user.id}
                                onClick={() => handleSelect(user.id)}
                                style={{
                                    padding: '10px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    borderBottom: '1px solid #f1f1f1'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f4f6fb'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
                            >
                                {user.username || user.email}
                            </li>
                        ))
                    ) : (
                        <li style={{ padding: '10px', color: '#999', fontSize: '14px' }}>No users found</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default UserSearchDropdown;
