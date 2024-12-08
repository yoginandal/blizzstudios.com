"use client";

import "./HamburgerMenu.css";

interface HamburgerMenuProps {
  toggleMenu: () => void;
}

const HamburgerMenu = ({ toggleMenu }: HamburgerMenuProps) => {
  return (
    <div className="nav-but-wrap_ankush">
      <div className="menu-icon_ankush" onClick={toggleMenu}>
        <button className="ham_ankush">
          <div className="atom_ankush"></div>
          <div className="atom_ankush"></div>
          <div className="atom_ankush"></div>
        </button>
      </div>
    </div>
  );
};

export default HamburgerMenu;
