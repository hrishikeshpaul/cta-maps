import React, { FunctionComponent } from "react";

import { Button } from "react-bootstrap";
import { FiSettings, FiInfo } from "react-icons/fi";

export const Nav: FunctionComponent = () => {
  return (
    <div className="nav w-100 p-3 d-flex justify-content-between align-items-center">
      <Button className="px-2 pt-1 bg-light text-dark border-0 shadow btn-lg">
        <FiInfo />
      </Button>
      <Button>Hello</Button>
      <Button className="px-2 pt-1 bg-light text-dark border-0 shadow-sm btn-lg">
        <FiSettings />
      </Button>
    </div>
  );
};
