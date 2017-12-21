import React from 'react';
import { Route } from 'react-router-dom';

// eslint-disable-next-line react/jsx-no-bind
const PropsRoute = ({ component, path, ...props }) => !component ? null : <Route path={path} render={({ ...routerProps }) => React.createElement(component, { ...props, ...routerProps })} />;

export default PropsRoute;