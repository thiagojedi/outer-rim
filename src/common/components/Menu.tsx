import { Fragment, FunctionalComponent } from "preact";

type MenuItem = {
  label: string;
  path: string;
};

type MenuSection = {
  label: string;
  children: MenuItem[];
};

type MenuProps = {
  menu: MenuSection[];
  url: URL;
  className?: string;
};

export const Menu: FunctionalComponent<MenuProps> = (
  { menu, url, className },
) => (
  <aside className={"menu " + className}>
    {menu.map(({ label, children }) => (
      <Fragment key={label}>
        <p className="menu-label">{label}</p>
        <ul className="menu-list">
          {children.map(({ label, path }) => (
            <li key={path}>
              <a
                className={url.pathname === path ? "is-active" : ""}
                href={path}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </Fragment>
    ))}
  </aside>
);
