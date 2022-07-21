const GObject = imports.gi.GObject;

const Example = GObject.registerClass({
    Signals: {
        'example-signal': {
            param_types: [GObject.TYPE_BOOLEAN, GObject.TYPE_STRING],
        },
    },
}, class Example extends GObject.Object {
});
let obj = new Example();

obj.connect('example-signal', (emittingObject, arg1, arg2) => {
    if (arg1) {
        log(`example-signal emitted: ${arg2}`);
    }
});

// expected output: "example-signal emitted: foobar"
obj.emit('example-signal', true, 'foobar');
