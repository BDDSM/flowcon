import React from 'react';
import PropTypes from 'prop-types';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

function SelectMgr({anchorEl, onClose, onSelect}) {
  return <Menu open anchorEl={anchorEl} onClose={onClose}>{
    $p.doc.issue._indexer._mgrs.map((mgr, index) => <MenuItem
      key={`m-${index}`}
      onClick={() => onSelect(mgr)}>
      {mgr.cachable.replace(/^doc$/, 'Личное')}
      </MenuItem>)
  }</Menu>;
}

SelectMgr.propTypes = {
  anchorEl: PropTypes.object,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
};

export default SelectMgr;
