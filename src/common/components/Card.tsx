import { FunctionComponent } from "preact";

type CardProps = Partial<{
  title: string;
  subtitle: string;
  image: string;
  content: string;
  avatar: string;
  imageAlt: string;
  avatarAlt: string;
}>;

export const Card: FunctionComponent<CardProps> = (
  { subtitle, title, image, content, imageAlt, avatar, avatarAlt },
) => {
  return (
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
      </div>
    </div>
  );
};
