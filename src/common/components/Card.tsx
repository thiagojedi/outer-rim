import { FunctionComponent, VNode } from "preact";

type CardProps = Partial<{
  title: string;
  subtitle: string;
  image: string;
  content: VNode;
  avatar: string;
  imageAlt: string;
  avatarAlt: string;
  footer: string[];
}>;

export const Card: FunctionComponent<CardProps> = (
  { subtitle, title, image, content, imageAlt, avatar, avatarAlt, footer },
) => (
  <div className="card">
    {image && (
      <div className="card-image">
        <figure className="image is-3by1">
          <img src={image} alt={imageAlt} />
        </figure>
      </div>
    )}
    <div className="card-content">
      <div className="media">
        {avatar && (
          <div className="media-left">
            <figure className="image is-48x48">
              <img src={avatar} alt={avatarAlt} />
            </figure>
          </div>
        )}
        <div className="media-content">
          <p className="title is-4">{title}</p>
          {subtitle && <p className="subtitle is-6">{subtitle}</p>}
        </div>
      </div>

      {content && (
        <div className="content">
          {content}
        </div>
      )}

      {footer && (
        <footer className="card-footer">
          {footer.map((item) => (
            <p className="card-footer-item">
              {item}
            </p>
          ))}
        </footer>
      )}
    </div>
  </div>
);
