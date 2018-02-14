import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import logo from './logo.svg';
import './App.css';

const VIEW_NONE = 'none';
const VIEW_SUMMARY = 'summary';
const VIEW_CART = 'cart';

class App extends Component {
  state = {
    view: VIEW_NONE,
    items: [
      {
        product: 'F22 Raptor',
        qty: 1
      },
      {
        product: 'B52 Carpet Bomber',
        qty: 2
      }
    ]
  }

  hideAll () {
    this.setState({view: VIEW_NONE});
  }

  showSummary () {
    this.setState({view: VIEW_SUMMARY});
  }

  showCart () {
    this.setState({view: VIEW_CART}, () => {
      const node = ReactDOM.findDOMNode(this.modal);
      node.style = 'display:block;';

      setTimeout(() => {
        node.classList.add('show');
      }, 300);
    });
  }

  render() {
    return (
      <div className="onecart">
        {(this.state.view === VIEW_SUMMARY)&&
        <div className="onecart-summary">
          <h2>Summary</h2>
          <p>Cart summary</p>
          <div className="btn-group">
            <a className="btn btn-default" href="#" onClick={() => this.hideAll()}>Close</a>
            <a className="btn btn-primary" href="#" onClick={() => this.showCart()}>Details</a>
          </div>
        </div>
        }
        {(this.state.view === VIEW_CART)&&
        <div className="onecart-cart">
          <div className="modal fade" tabIndex="-1" role="dialog" ref={(node) => this.modal = node}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Your cart</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                <ul className="list-group list-group-flush">
                {this.state.items.map((it, i) =>
                  <li className="list-group-item" key={i}>
                    {it.product}
                    <div className="float-right input-group" style={{width: 140}}>
                      <input type="number" className="form-control" value={it.qty} />
                      <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button">Remove</button>
                      </div>
                    </div>
                  </li>
                )}
                </ul>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary">Check out now!</button>
                  <button type="button" className="btn btn-secondary" onClick={() => this.hideAll()}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        }
      </div>
    );
  }
}

export default App;
