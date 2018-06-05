import React from 'react';
import ListItem from './ListItem.jsx';

const List = (props) => (
  <div>
    There are { props.items.length } messages.
    { props.items.map((item, index) => <ListItem item={item} key={index}/>)}
  </div>
)

export default List;