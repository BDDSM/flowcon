/**
 * Категории активностей
 *
 * @module Categories
 *
 * Created by Evgeniy Malyarov on 28.11.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';

import ActivityRow from './ActivityRow';
import calculate from './calculate';
import register from './register';
import {categories} from './activity_options';
import cn from 'classnames';
import qs from 'qs';

class Categories extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {busy: false};
    this.select = $p.wsql.alasql.compile('select ref from cat_activity where `use` == true and `flow` = ? order by sorting_field, name');
    this.calculate = calculate.bind(this);
    this.register = register.bind(this);
  }

  componentDidMount(){
    this.calculate();
  }

  shouldComponentUpdate(nextProps) {
    if(this.props.periodicity !== nextProps.periodicity || this.props.date !== nextProps.date) {
      this.calculate(nextProps.periodicity, nextProps.date);
      return false;
    }
    return true;
  }

  render() {
    const {props: {classes, totals, periodicity, navigate}, state: {busy}} = this;
    const {activity} = $p.cat;
    const prm = qs.parse(location.search.replace('?',''));

    return [<div key="progress" className={classes.placeholder}>
      <Fade
        in={busy}
        style={{
          transitionDelay: busy ? '300ms' : '0ms',
        }}
        unmountOnExit
      >
        <CircularProgress size={80}/>
      </Fade>
    </div>].concat(
      categories.map((row, cind) => {
        return <ExpansionPanel
          key={`c-${cind}`}
          className={busy ? classes.busy : ''}
          defaultExpanded={row.predefined_name === prm.open}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" component="h3" color="primary" className={classes.flex}>{row.name}</Typography>
            <Typography color="primary" className={cn(classes.mr48, classes.ptop)}>{(totals.get(row) || 0).toFixed(0)}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails classes={{root: classes.details}}>
            {this.select([row.ref]).map(({ref}, aind) => <ActivityRow
              key={`a-${cind}-${aind}`}
              classes={classes}
              row={activity.get(ref)}
              totals={totals}
              navigate={navigate}
              periodicity={periodicity}
              register={(activity, minus) => {
                this.register(activity, minus)
                  .then(() => this.calculate());
              }}
            />)}
          </ExpansionPanelDetails>
        </ExpansionPanel>;
      })
    );
  }
}

Categories.propTypes = {
  classes: PropTypes.object.isRequired,
  periodicity: PropTypes.string.isRequired,
  totals: PropTypes.object.isRequired,
  date: PropTypes.object.isRequired,
  handleTotals: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default Categories;
