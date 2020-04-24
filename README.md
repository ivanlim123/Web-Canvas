# Software Studio 2020 Spring
## Assignment 01 Web Canvas


### Scoring

| **Basic components**                             | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |
| Basic control tools                              | 30%       | Y         |
| Text input                                       | 10%       | Y         |
| Cursor icon                                      | 10%       | Y         |
| Refresh button                                   | 10%       | Y         |

| **Advanced tools**                               | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |
| Different brush shapes                           | 15%       | Y         |
| Un/Re-do button                                  | 10%       | Y         |
| Image tool                                       | 5%        | Y         |
| Download                                         | 5%        | Y         |

| **Other useful widgets**                         | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |
| Name of widgets                                  | 1~5%     | Y         |


---

### How to use 

    Describe how to use your web and maybe insert images to help you explain.
![](https://i.imgur.com/tcS2KGo.png)
左邊空白區域是canvas，右邊區域是工具欄。

### 工具欄:
#### Color Picker
Color Picker🎨是一個canvas，使用Linear Gradient的方式，在canvas填上各種顏色，在調色盤上拖曳即可改變筆刷顏色。
從左到右：紅->紫->藍->藍青->青->黃->紅
從上到下：白->黑

#### Brush Width
Brush Width是一個input，type=range，在brush width上拖曳即可改變筆刷和圖形邊框大小。

#### Font Family, Font Size
Font Family是一個select，可以選擇的字型有9種，分別是Arial Black，Impact，Cursive，Fantasy，Times New Roman，華文仿宋，華文宋體，華文黑體和標楷體。
Font Size是一個select，可以選擇字體大小。

#### Pencil
Pencil是一個button，點選之後可以在canvas的區域畫畫。 
使用lineTo和moveTo就能實現筆刷的功能，在canvas拖曳滑鼠即可使用筆刷畫畫。
筆刷在拖曳出canvas外的時候並不會停止，只有放開滑鼠的時候才會停止。

#### Eraser
Eraser是一個button，點選之後可以去除canvas上的任何字跡。
使用lineTo和moveTo就能實現橡皮擦的功能，在canvas拖曳滑鼠即可使用橡皮擦消除掉筆刷，圖形，文字和背景顏色。
轉換成橡皮擦的時候，需要將global composite operation設成'destination-out'，轉換成其他tools的時候則需要將global composite operation設成'source-over'。
橡皮擦在拖曳出canvas外的時候並不會停止，只有放開滑鼠的時候才會停止。

#### Text Input
Text Input是一個button，點選之後可以在canvas的區域輸入文字。
滑鼠點擊canvas的時候，會創建一個input，type=text，然後把這個element append到document上，並且使用request animation frame的方式去檢查text element的存在，當canvas上面存在text element的時候，就focus在text上面，這樣就能實作點到canvas的位置出現text box的功能。當使用者輸入Enter/Escape/滑鼠移出canvas外的時候，就會把使用者輸入在text element上的文字使用fillText印在canvas上，並把text element從document移除。

#### Line
Line是一個button，點選之後可以在canvas的區域畫上一條線。
使用lineTo和moveTo就能實現線條的功能，在canvas點擊，拖曳滑鼠至放開就能畫出一條線。
線條在拖曳出canvas外的時候並不會停止，只有放開滑鼠的時候才會停止。

#### Circle
Circle是一個button，點選之後可以在canvas的區域上畫圓圈。
使用ellipse(centerX, centerY, radiusX, radiusY)就能實現畫圓圈的功能。在canvas點擊就會紀錄初始的位置，在拖曳的時候會去計算結束的位置，以這兩點的距離來計算中心點和半徑。
圓圈在拖曳出canvas外的時候並不會停止，只有放開滑鼠的時候才會停止。

#### Triangle
Triangle是一個button，點選之後可以在canvas的區域上畫三角形。
使用lineTo和moveTo就能實現畫三角形的功能。在canvas點擊就會紀錄初始的位置，在拖曳的時候會去計算結束的位置，以這兩點的距離來計算三角形三個頂點的位置，這樣的計算方式會讓畫出來的三角形與x軸和y軸鏡像，因此會產生倒三角形的圖形。
三角形在拖曳出canvas外的時候並不會停止，只有放開滑鼠的時候才會停止。

#### Rectangle
Rectangle是一個button，點選之後可以在canvas的區域上畫長方形。
使用lineTo和moveTo就能實現畫長方形的功能。在canvas點擊就會紀錄初始的位置，在拖曳的時候會去計算結束的位置，以這兩點的距離來計算長方形四個角落的位置，這樣的計算方式會讓畫出來的長方形與x軸和y軸鏡像。
長方形在拖曳出canvas外的時候並不會停止，只有放開滑鼠的時候才會停止。

#### Fill
Fill是一個button，點選之後可以在實心圖形和空心圖形中互相轉換。UI方面為了方便使用者了解目前是在畫實心/空心圖形，會在點擊button的時候，切換圓形，三角形和長方形的icon。此外，canvas的cursor也會一起切換。

#### Undo
Undo是一個button，點選之後會回到上一個canvas的狀態。當滑鼠在canvas上點擊的時候，會先把當前canvas的狀態save下來，以圖片的形式push到undo list。當點到undo button的時候，如果undo list裡面有element，則把目前的canvas以圖片的形式push到redo list，同時從undo list裡面pop出上一個canvas的照片，然後以drawImage的形式把這個照片畫在目前的canvas上，這樣就能完成undo的功能。

#### Redo
Redo是一個button，點選之後如果redo list裡面有element，就把目前的canvas以圖片的形式push到undo list，同時從redo list裡面pop出undo前canvas的照片，然後以drawImage的形式把這個額照片畫在目前的canvas上，這樣就能完成redo的共能。
由於滑鼠在canvas上點擊的時候，會先把當前canvas的狀態save下來，這個時候會判斷目前不是在執行redo的動作，會把redo list清空。

#### Download
Download是一個button，點選之後會把當前的canvas以png的格式下載下來。首先create一個hyperlink的element，把這個element append到document上面，並把href設成canvas.toDataURL，把下載的檔名設成canvas-image.png，對hyperlink點擊就能下載圖片，下載之後會把這個element從document中remove。

#### Upload
Upload是一個input，type=file，accept=image/*，點選之後可以把選擇一張圖片作為canvas的背景圖。對這個input element add event listener ("change")，當有照片被選上的時候，會先把foreground和background的canvas清空，然後再把undo list和redo list清空，把剛剛選上的圖片以drawImage的形式畫在canvas上，同時把foreground和background的canvas的height和width設成和圖片一樣。

#### Clear
Clear是一個button，點選之後會把foreground和background的canvas清空，並還原成初始的height和width，然後再把undo list和redo list清空。

#### Rainbow Brush
Rainbow Brush是一個button，點選之後可以在canvas的區域畫彩虹🌈。 
使用lineTo和moveTo就能實現彩虹筆的功能，在canvas上畫畫，筆刷會呈現彩虹的顏色
使用hsl color，在canvas拖曳滑鼠的時候會一直改變hue的value，實現彩虹筆的功能。
彩虹筆在拖曳出canvas外的時候並不會停止，只有放開滑鼠的時候才會停止。

### Function description

    Decribe your bouns function and how to use it.

Tool: Rainbow Brush, Fill

為了解決flickering canvas的問題，我把canvas分成兩層layer，分別是foreground canvas和background canvas。
圖形都是先畫在前景，這樣的效果就是每次在重畫圖形的時候只有當前的圖形被刪，並不會影響到背景，不需要每次把整張圖片刪了再重畫，因此不會出現flickering canvas的畫面，當畫完之後才會把圖形加到背景。

### Gitlab page link

    your web page URL, which should be "https://[studentID].gitlab.io/AS_01_WebCanvas"    
https://107000276.gitlab.io/AS_01_WebCanvas

### Others (Optional)

    Anything you want to say to TAs.

<style>
table th{
    width: 100%;
}
</style>
