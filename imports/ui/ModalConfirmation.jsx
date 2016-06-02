import React, { Component, PropTypes } from 'react';

export default class ModalConfirmation extends Component {
    render() {
        return (
            <div id={this.props.modalId} className="modal" role="dialog">
                <div className="modal-dialog modal-vertical-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" ariaLabel="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">{this.props.title}</h4>
                        </div>
                        <div className="modal-body">
                            {this.props.body}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className={this.props.buttonClass} data-dismiss="modal" onClick={this.props.onConfirm}>{this.props.confirmLabel}</button>
                            <button type="button" className="btn btn-default" data-dismiss="modal">{this.props.cancelLabel}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
