import React from 'react';

const ListItem = (props) => (
  <div>
    <strong>{ props.item.name }: </strong> {props.item.message}
  </div>
)

export default ListItem;