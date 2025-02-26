import { type PageProps } from "fresh";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>outer-ring</title>
        <link
          rel="stylesheet"
          href="/bulma.min.css"
        />
        <link href="/fontawesome/css/fontawesome.css" rel="stylesheet" />
        <link href="/fontawesome/css/brands.css" rel="stylesheet" />
        <link href="/fontawesome/css/solid.css" rel="stylesheet" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
