import { app } from '/scripts/app.js';

/**
 * Align nodes
 */
app.registerExtension({
  name: 'kinda-prettier.AlignSelectedNodes',
  setup() {
    const alignNodes = (direction) => {
      LGraphCanvas.alignNodes(app.canvas.selected_nodes, direction.toLowerCase());
    };

    app.canvasEl.addEventListener('keydown', (event) => {
      if (event.altKey) {
        event.preventDefault();
        const keyActions = {
          KeyA: () => alignNodes('left'),
          KeyD: () => alignNodes('right'),
          KeyW: () => alignNodes('top'),
          KeyS: () => alignNodes('bottom'),
        };
        const action = keyActions[event.code];
        if (action) {
          action();
        }
      }
    });
  },
});

/**
 * Context menu scrolling speed
 */
app.registerExtension({
  name: 'kinda-prettier.MenuScrollSpeed',
  setup() {
    const ctxScrollSpeed = LiteGraph.ContextMenu;
    const replace = () => {
      LiteGraph.ContextMenu = function (values, options) {
        options = options || {};
        let scrollIsInverted = app.ui.settings.getSettingValue('Comfy.InvertMenuScrolling');
        if (scrollIsInverted) {
          options.scroll_speed = 0.1 * ctxScrollSpeedSettings.value;
        } else {
          options.scroll_speed = -0.1 * ctxScrollSpeedSettings.value;
        }
        return ctxScrollSpeed.call(this, values, options);
      };
      LiteGraph.ContextMenu.prototype = ctxScrollSpeed.prototype;
    };
    const ctxScrollSpeedSettings = app.ui.settings.addSetting({
      id: 'kinda-prettier.MenuScrollSpeed',
      name: 'Menu scrolling speed',
      type: 'slider',
      attrs: {
        min: 1,
        max: 15,
        step: 1,
      },
      defaultValue: 4,
      onChange() {
        replace();
      },
    });
  },
});
