import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as apiAction from '../actions/api_actions';

class CsrfTestComponent extends React.Component {

  static propTypes = {
    csrf_test_result: React.PropTypes.string.isRequired,
    actions: React.PropTypes.array.isRequired,
  }

  click = () => {
    this.props.actions.csrfTest();
  }
  render() {
    return (
      <div>
        <button onClick={this.click}>Test CSRF</button>
        <div>CSRF test: {this.props.csrf_test_result}</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    csrf_test_result: state.api.csrf_test_result,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(apiAction, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CsrfTestComponent);

