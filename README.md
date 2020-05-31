# charrom_fr_nesfile
NESファイルからキャラクターROMを抜き出してpng に変換する。

- refer Qiita : [ファミコンエミュレータの創り方　- Hello, World!編 -](https://qiita.com/bokuweb/items/1575337bef44ae82f4d3)
  - github : https://github.com/bokuweb/nes-sprites2png

## Example
```
node charrom.js "samples/hello.nes" "hello_charrom.png"
```
  - "hello_charrom.png" : output file. (if shorted, write file is skipped.)
or
```
node charrom.js "samples/hello.nes" "ascii"
```
  - "ascii" : if specify "ascii" as argv[2], display charrom as ascii art.


## License
```
The MIT License (MIT)

Copyright (c) 2016 @Bokuweb and 2020 @sgtao

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
