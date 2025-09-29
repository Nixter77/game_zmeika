import React from 'react';
import './Cell.css';

function Cell({ type, isHead }) {
  const classes = `cell ${type}` + (isHead ? ' head' : '');
  let label = 'empty';
  if (type === 'food') label = 'food';
  else if (type === 'snake') label = isHead ? 'snake-head' : 'snake';
  return <div className={classes} data-label={label} title={label}></div>;
}

// PropTypes are optional in this small project; disabling warning for now
/* eslint-disable react/prop-types */

export default Cell;
