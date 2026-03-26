"use client";
import styles from "./DotNavigation.module.css";

interface Section {
  id: string;
  label: string;
}

interface Props {
  sections: Section[];
  activeSection: string;
  onNavigate: (id: string) => void;
}

export default function DotNavigation({ sections, activeSection, onNavigate }: Props) {
  return (
    <nav className={styles.nav} aria-label="Section navigation">
      {sections.map((section) => (
        <button
          key={section.id}
          className={`${styles.dot} ${activeSection === section.id ? styles.active : ""}`}
          onClick={() => onNavigate(section.id)}
          aria-label={section.label}
          data-label={section.label}
          title={section.label}
        />
      ))}
    </nav>
  );
}
