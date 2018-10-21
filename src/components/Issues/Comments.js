/**
 *
 *
 * @module
 *
 * Created by Evgeniy Malyarov on 21.10.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import CommentEditor from './CommentEditor';


function Comments (props) {
  const {classes, _obj, add_note, del_note} = props;
  const notes = [];
  _obj && _obj.notes.forEach((row) => {
    notes.push(
      <CommentEditor
        key={`n-${row.row}`}
        _obj={row}
        _fld="note"
        caption={`${moment(row.date).format(moment._masks.date_time)} ${row.author.presentation}`}
        classes={classes}
        handleDelete={() => del_note(row)}
      />
    );
  });

  return (
    <div>
      {notes}
      <Button
        variant="fab"
        mini
        title="Добавить комментарий"
        onClick={add_note}
        style={{marginTop: 8}}
      >
        <AddIcon />
      </Button>
    </div>
  );
}

export default Comments;