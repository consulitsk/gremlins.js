export default () => ({ window }) => {
    const document = window.document;
    const originalElementFromPoint = document.elementFromPoint;
    const originalQuerySelectorAll = document.querySelectorAll;

    const zkModal = () => {
        const modal = document.querySelector('.z-window-modal, .z-popup');
        if (!modal) return;

        // Restrict elementFromPoint to the modal
        document.elementFromPoint = (x, y) => {
            const { top, left, width, height } = modal.getBoundingClientRect();
            if (x < left || x > left + width || y < top || y > top + height) {
                return null; // Outside the modal
            }
            return originalElementFromPoint.call(document, x, y);
        };

        // Restrict querySelectorAll to the modal
        document.querySelectorAll = (selector) => {
            return modal.querySelectorAll(selector);
        };
    };

    zkModal.cleanUp = () => {
        document.elementFromPoint = originalElementFromPoint;
        document.querySelectorAll = originalQuerySelectorAll;
    };

    return zkModal;
};
