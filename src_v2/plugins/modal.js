import Modal from './modal/';

let modalInstance;

function getModalInstance(render = undefined) {
    modalInstance = modalInstance || Modal.newInstance({
        closable: false,
        maskClosable: false,
        render: render
    });

    return modalInstance;
}

function confirm(options) {
    const render = ('render' in options) ? options.render : undefined;
    let instance = getModalInstance(render);

    options.onRemove = function() {
        modalInstance = null;
    };

    instance.show(options);
}

Modal.confirm = function(props = {}) {
    return confirm(props);
};

Modal.postMenu = function(props = {}) {
    return confirm(props);
};

Modal.remove = function() {
    if(!modalInstance) { // at loading status, remove after Cancel
        return false;
    }

    const instance = getModalInstance();

    instance.remove();
};

export default {
    install(vue) {
        if(this.installed) return;
        vue.prototype.$Modal = Modal;
    }
}