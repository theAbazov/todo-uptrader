import React, { FC, useState } from "react";

export const Attach: FC = () => {
  const [link, setLink] = useState<any[]>([]);

  const change = (file: any) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      const { name } = file;
      setLink((prev) => [...prev, { name, href: reader.result }]);
    });
    reader.readAsDataURL(file);
  };

  return (
    <div className="App">
      <input
        type="file"
        onChange={(event) => {
          change(event.target.files![0]);
        }}
        size={1000000}
      />
      {link &&
        link.map(({ href, name }) => {
          return (
            <div>
              <a href={href} target="_blank" rel="noreferrer">
                {name}
              </a>
            </div>
          );
        })}
    </div>
  );
};
