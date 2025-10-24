const getDefaultConfig = (randomizer, window) => {
    const document = window.document;
    const body = document.body;

    const defaultCanClick = (element) => {
        return (
            element.tagName === 'TR' &&
            element.classList.contains('z-listitem')
        );
    };

    const defaultShowAction = (x, y) => {
        const clickSignal = document.createElement('div');
        clickSignal.style.zIndex = 2000;
        clickSignal.style.border = '3px solid blue';
        clickSignal.style.borderRadius = '50%';
        clickSignal.style.width = '40px';
        clickSignal.style.height = '40px';
        clickSignal.style.boxSizing = 'border-box';
        clickSignal.style.position = 'absolute';
        clickSignal.style.transition = 'opacity 1s ease-out';
        clickSignal.style.left = x - 20 + 'px';
        clickSignal.style.top = y - 20 + 'px';
        const element = body.appendChild(clickSignal);
        setTimeout(() => {
            body.removeChild(element);
        }, 1000);
        setTimeout(() => {
            element.style.opacity = 0;
        }, 50);
    };

    return {
        canClick: defaultCanClick,
        showAction: defaultShowAction,
        log: false,
    };
};

export default (userConfig) => ({ logger, randomizer, window }) => {
    const document = window.document;
    const config = {
        ...getDefaultConfig(randomizer, window),
        ...userConfig,
    };

    return () => {
        const listitems = [
            ...document.querySelectorAll('.z-listitem'),
        ];
        if (listitems.length === 0) return;

        const targetElement = randomizer.pick(listitems);

        if (!config.canClick(targetElement)) return;

        const { top, left, width, height } = targetElement.getBoundingClientRect();
        const posX = left + width / 2;
        const posY = top + height / 2;

        const clickEvent = document.createEvent('MouseEvents');
        clickEvent.initMouseEvent(
            'click',
            true,
            true,
            window,
            0,
            0,
            0,
            posX,
            posY,
            false,
            false,
            false,
            false,
            0,
            null
        );
        targetElement.dispatchEvent(clickEvent);

        if (typeof config.showAction === 'function') {
            config.showAction(posX, posY, 'click');
        }

        if (logger && config.log) {
            logger.log('gremlin', 'zkListbox', 'click', 'at', posX, posY);
        }
    };
};
