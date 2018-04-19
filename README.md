# sclazy
scroll + lazy

## example

in riot

```
this.on('mount', function() {
  this.sclazy = Sclazy({
    target: this.refs.content,
    onload: () => {
      ref.child('items').get({
        page: this.sclazy.page++,
        per: 32,
      }).then((res) => {
        this.sclazy.addItems(res.data.items);
        this.sclazy.next(res.data.page_info.next_page != null);
        this.update();
      });
    },
    onscrollend: () => {
      this.sclazy.load();
    },
    onpulldown: () => {
      this.sclazy.reset().load();
      this.update();
    },
  });

  this.sclazy.load();
  this.update();
});
```

## ref

- https://github.com/phi-jp/spat/blob/develop/src/spat-list.pug
- http://rubaxa.github.io/Sortable/