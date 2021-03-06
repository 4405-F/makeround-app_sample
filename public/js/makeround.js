console.log(sessionStorage.length);

//セッションストレージからparticipantsを取得する。
let protoParticipant;
let participants = [];

//解説
    //sessionStorageはなぜか順番が逆転している。最後に追加した要素がsessionStorageの最初の要素みたい。
    //そしてkey(i)はsessionStorage[i]なので、-1してあげないとnullになる。
    //for文のiとは別に、kを用意した。おそらくsessionStorageに保存される順番はデタラメなので全てをiで揃えると目的のキーが見つかったときのiがparticipant_iになってメチャクチャになるのだろう。
let w = 0;
for (let i = 0; i < sessionStorage.length; i++) {
    if (sessionStorage.key(sessionStorage.length - 1 - i).match(/participant_/)) {  
        protoParticipant = JSON.parse(sessionStorage.getItem('participant_' + String(w)));
        protoParticipant.howMany = 0;
        protoParticipant.withWhoName = [];
        console.log('protoParticipant:' + protoParticipant);
        participants.push(protoParticipant);
        w++;
    }
}

console.log(participants);

for (let j = 0; j < participants.length; j++) {
    console.log(participants[j]);
}

//ラウンドを組みやすいように、participantsを男女に分ける。
let 
    maleParticipants = [],
    femaleParticipants = []
;
for (let i = 0; i < participants.length; i++) {
    if (participants[i].gender === 1) {
        maleParticipants.push(participants[i]);
    } else {
        femaleParticipants.push(participants[i]);
    }
}

//テスト
console.log('participantsの確認:' + participants);
console.log(participants[2]);
console.log(participants[2].name);
console.log(participants[2].withWhoName);
console.log(participants[2].withWhoName.includes('あんたす'));
console.log('participants[2]の確認:' + participants[2]);
console.log('femaleParticipantsの確認:' + femaleParticipants);
console.log('maleParticipantsの確認:' + maleParticipants);


//セッションストレージからroundSetDataを取得する。
let roundSetData = [];

//解説
    //sessionStorageでは逆転現象が起きているので工夫が必要。実際にインデックスを試してみるのがよい。
let a = 0;
for (let i = 0; i < sessionStorage.length; i++) { //-1は面数の分
    if (sessionStorage.key(sessionStorage.length - 1 - i).match(/roundSet_/)) {
        roundSetData.push(JSON.parse(sessionStorage.getItem('roundSet_' + String(a))));
        a++;
    }
}

for (let j = 0; j < roundSetData.length; j++) {
    console.log(roundSetData[j]);
}


//セッションストレージからcourtNumを取得する。
let courtNum = sessionStorage.getItem('courtNum');
console.log('面数：' + courtNum);





//ホームボタンを押すなどして別のページに移動した場合のデータ保存期間に注意。
//ページ遷移するたびにセッションストレージのデータをリフレッシュするなど。

//ラウンド数の合計を計算
let totalNumOfRound = 0;

for (let i = 0; i < roundSetData.length; i++) {
    console.log('roundSetData[' + String(i) + ']のラウンド数：' + roundSetData[i].numOfRound);
    totalNumOfRound += roundSetData[i].numOfRound;
}
console.log('ラウンド数の合計：' + totalNumOfRound);

//numOfPerson：合計入る人数。
let numOfPerson = courtNum * 4 * totalNumOfRound;

//関数makeTable()
//表を表示する関数。表の側だけ作る。中身はmakeRound()に、最後の表示はshowResult()に任せる。
const makeTable = () => {
    console.log('合計人数：' + numOfPerson);

    let
        resultWrapper,
        roundWrapper,
        roundTitle,
        roundTable,
        roundTableRow,
        roundTableData
    ;
    
    //appendChildをfor文の各ループの最後の行で実行しているのが肝！
    resultWrapper = document.getElementById('result-wrapper');
    for (let i = 0; i <totalNumOfRound; i++) {
        //h3要素を作成しclassを設定。
        roundTitle = document.createElement('h3');
        roundTitle.setAttribute('class', 'round-title');
        //div要素を作成しclassを設定。
        roundWrapper = document.createElement('div');
        roundWrapper.setAttribute('class', 'round-wrapper');

        for (let j = 0; j < courtNum; j++) {
            roundTable = document.createElement('table');
            //table要素にclassとidを設定
            roundTable.setAttribute('class', 'round');  
            roundTable.setAttribute('id', 'round-' + String((j+1) + 10*(i+1)));
            for (let k = 0; k < 2; k++) {
                roundTableRow = document.createElement('tr');
                for (let l = 0; l < 2; l++) {
                    roundTableData = document.createElement('td');
                    roundTableData.setAttribute('id', String(l + 2*k + 4*j + (4*courtNum)*i));  //td要素にidを設定。
                    roundTableRow.appendChild(roundTableData);
                }

                roundTable.appendChild(roundTableRow);
            }

            roundWrapper.appendChild(roundTable);
        }
        
        resultWrapper.appendChild(roundTitle);
        resultWrapper.appendChild(roundWrapper);
    }


}

makeTable();


//ここから関数makeRoundの実装。
//makeRoundは複数の関数で構成されている。


//関数isOverlapping
//同一ラウンドに同じ人が入っていないか真偽値を返す。
//同じ人が入っていたらfalse、入っていなかったらtrue
const isOverlapping = (participant, array, start, end) => {
    if (start === end) {
        return true;
    } else {
        let partOfArray = array.slice(start, end);
        let tempNameArray = [];
        partOfArray.forEach((item) => {
            tempNameArray.push(item.name);
        });
        // console.log('tempNameArray:' + tempNameArray);
        return Boolean(1 - tempNameArray.includes(participant.name));
    }
}

//関数isOverSelected
//指定回数よりも多くラウンドに入っていないか真偽値を返す。
//以下ならtrue、より大きかったらfalse
const isOverSelected = (participant, limit) => {
    return (participant.howMany < limit);
}

//関数isSamePerson
//同じ同じ相手と打っていないか真偽値を返す。
//endはこれから入ろうとしているresultArrayの要素番号。
//isOverlappingと違ってコートの中だけ見ればいいのでstartを使うまでもない。
//同じ相手と打っていなかったらtrue、打っていたらfalse
const isSamePerson = (participant, array, end) => {
    let judge;
    switch (end % 4) {
        case 0:
            judge = true;  
            break;  //おそらくreturnしているので、break文は不要のはず。
        case 1:
            judge = true;
            break;
        case 2:
            judge = Boolean(1 - participant.withWhoName.includes(array[end-1].name));
            break;
        case 3:
            judge = Boolean(1 - participant.withWhoName.includes(array[end-3].name));
            break;
    }
    return judge;
}

//関数plusHowMany
//resultArrayに条件に合う要素を追加する際に実行する。
//howManyを+1する。
//使うかわからん。
const plusHowMany = (candidate) => {
    candidate.howMany += 1;
}

const pushWithWho = (candidate, index, array, end) => {
    if (index % 4 === 2) {
        candidate.withWhoName.push(array[end-1].name);
        array[end-1].withWhoName.push(candidate.name);
    } else if (index % 4 === 3) {
        candidate.withWhoName.push(array[end-3].name);
        array[end-3].withWhoName.push(candidate.name);
    } else {
        ;
    }
}

const calcLimit = (dataArray, courtNum, persons) => {
    let 
        maleNum = 0,
        femaleNum = 0,
        commonNum = persons.length,

        totalMaleNum = 0,
        totalFemaleNum = 0,
        totalCommonNum = 0,

        maleLimit = 0,
        femaleLimit = 0,
        commonLimit = 0
    ;

    persons.forEach((person) => {
        if (person.gender === 1) {
            maleNum += 1;
        } else if (person.gender === 2) {
            femaleNum += 1;
        } else {
            ;
        }
    });

    for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i].ratio !== 5) {
            totalMaleNum += (4 - dataArray[i].ratio) * courtNum * dataArray[i].numOfRound;
            totalFemaleNum += dataArray[i].ratio * courtNum * dataArray[i].numOfRound;
        } else {
            totalCommonNum += 4 * courtNum * dataArray[i].numOfRound;
        }
    }

    if (totalMaleNum % maleNum === 0) {
        maleLimit = totalMaleNum / maleNum;
    } else {
        maleLimit = Math.floor(totalMaleNum / maleNum) + 1;
    }

    if (totalFemaleNum % femaleNum === 0) {
        femaleLimit = totalFemaleNum / femaleNum;
    } else {
        femaleLimit = Math.floor(totalFemaleNum / femaleNum) + 1;
    }

    if (totalCommonNum % commonNum === 0) {
        commonLimit = totalCommonNum / commonNum;
    } else {
        commonLimit = Math.floor(totalCommonNum / commonNum) + 1;
    }

    console.log('calcLimitの計算結果、maleLimit:' + maleLimit);
    console.log('calcLimitの計算結果、femaleLimit:' + femaleLimit);
    console.log('calcLimitの計算結果、commonLimit:' + commonLimit);


    return [maleLimit, femaleLimit, commonLimit];
}

//関数makeRound
//参加者のデータ郡（participants）をもとに、ラウンドを組む。
const makeRound = () => {
    //participantsから乱数でインデックスを指定することでランダムな選択を実装する。
    const getRandomInt = (max) => {
        return Math.floor(Math.random() * Math.floor(max));
    }

    //配列resultArray
    //td要素のidとresultArrayのインデックスを連携させて結果を表示する
    //これが完成させることがゴールと言っても過言ではない！
    let resultArray = new Array(numOfPerson);
    let femaleRatio;
    let limitArray = calcLimit(roundSetData, courtNum, participants);


    for (let i = 0; i < roundSetData.length; i++) {
        console.log('roundSetData.length：' + roundSetData.length);
        
        for (let j = 0; j <roundSetData[i].numOfRound; j++) {
            console.log('roundSetData[' + String(i) + '].numOfRound：' + roundSetData[i].numOfRound);
            for (let k = 0; k < courtNum; k++) {
                let trick = i;  //なんかセンス悪い気がする。修正したい。
                if (i === 0) {
                    trick = 0;
                } else {
                    trick = i - 1;
                }
                
                if (roundSetData[i].ratio !== 5) {
                    femaleRatio = roundSetData[i].ratio;
                    console.log('roundSetData[' + String(i) + '].ratio：' + roundSetData[i].ratio);
                    
                    
                    for (let l = 0; l < femaleRatio; l++) {
                        let 
                            candidate = femaleParticipants[getRandomInt(femaleParticipants.length)],
                            start = 4*courtNum*j + 4*courtNum*roundSetData[trick].numOfRound*i,
                            end = l + 4*k + start
                        ;


                        let keyNum = 0;
                        let countNum = 0;
                        femaleParticipants.forEach((item) => {
                            if (isOverlapping(item, resultArray, start, end)
                                && isOverSelected(item, limitArray[1])
                                && isSamePerson(item, resultArray, end)) {
                                countNum = 3;
                            } else if (isOverlapping(item, resultArray, start, end)
                                && isOverSelected(item, limitArray[1])) {
                                countNum = 2;
                            } else if (isOverlapping(item, resultArray, start, end)) {
                                countNum = 1;
                            } else {
                                countNum = 0;
                            }
                            if (keyNum < countNum) {
                                keyNum = countNum;
                            }
                        })

                        // console.log('keyNum[' + String(end) + ']' + keyNum);

                        switch (keyNum) {
                            case 0:
                                alert('ラウンドを組めません');
                                break;
                            case 1:
                                while (Boolean(1 - isOverlapping(candidate, resultArray, start, end))) {
                                    candidate = femaleParticipants[getRandomInt(femaleParticipants.length)];
                                }
                                resultArray[end] = candidate;
                                candidate.howMany += 1;
                                pushWithWho(candidate, l, resultArray, end);
                                break;

                            case 2:
                                while (Boolean(1 - isOverlapping(candidate, resultArray, start, end) 
                                * isOverSelected(candidate, limitArray[1]))) {
                                    candidate = femaleParticipants[getRandomInt(femaleParticipants.length)];
                                }
                                resultArray[end] = candidate;
                                candidate.howMany += 1;
                                pushWithWho(candidate, l, resultArray, end);
                                break;

                            case 3:
                                while (Boolean(1 - isOverlapping(candidate, resultArray, start, end) 
                                * isOverSelected(candidate, limitArray[1]) 
                                * isSamePerson(candidate, resultArray, end))) {
                                    candidate = femaleParticipants[getRandomInt(femaleParticipants.length)];
                                }
                                resultArray[end] = candidate;
                                candidate.howMany += 1;
                                pushWithWho(candidate, l, resultArray, end);
                                break;
                        }
                    }
                    
                    for (let l = femaleRatio; l < 4; l++) {
                        let 
                            candidate = maleParticipants[getRandomInt(maleParticipants.length)],
                            start = 4*courtNum*j + 4*courtNum*roundSetData[trick].numOfRound*i,
                            end = l + 4*k + start
                        ;

                        let keyNum = 0;
                        let countNum = 0;
                        maleParticipants.forEach((item) => {
                            if (isOverlapping(item, resultArray, start, end) 
                            && isOverSelected(item, limitArray[0]) 
                            && isSamePerson(item, resultArray, end)) {
                                countNum = 3;
                            } else if (isOverlapping(item, resultArray, start, end) 
                            && isOverSelected(item, limitArray[0])) {
                                countNum = 2;
                            } else if (isOverlapping(item, resultArray, start, end)) {
                                countNum = 1;
                            } else {
                                countNum = 0;
                            }
                            if (keyNum < countNum) {
                                keyNum = countNum;
                            }
                        })


                        switch (keyNum) {
                            case 0:
                                alert('ラウンドを組めません');
                                break;
                            case 1:
                                while (Boolean(1 - isOverlapping(candidate, resultArray, start, end))) {
                                    candidate = maleParticipants[getRandomInt(maleParticipants.length)];
                                }
                                resultArray[end] = candidate;
                                candidate.howMany += 1;
                                pushWithWho(candidate, l, resultArray, end);
                                break;

                            case 2:
                                while (Boolean(1 - isOverlapping(candidate, resultArray, start, end) 
                                * isOverSelected(candidate, limitArray[0]))) {
                                    candidate = maleParticipants[getRandomInt(maleParticipants.length)];
                                }
                                resultArray[end] = candidate;
                                candidate.howMany += 1;
                                pushWithWho(candidate, l, resultArray, end);
                                break;

                            case 3:
                                while (Boolean(1 - isOverlapping(candidate, resultArray, start, end) 
                                * isOverSelected(candidate, limitArray[0]) 
                                * isSamePerson(candidate, resultArray, end))) {
                                    candidate = maleParticipants[getRandomInt(maleParticipants.length)];
                                }
                                resultArray[end] = candidate;
                                candidate.howMany += 1;
                                pushWithWho(candidate, l, resultArray, end);
                                break;
                        }
                    }
                } else {
                    for (let l = 0; l < 4; l++) {
                        let 
                            candidate = participants[getRandomInt(participants.length)],
                            start = 4*courtNum*j + 4*courtNum*roundSetData[trick].numOfRound*i,
                            end = l + 4*k + start
                        ;
                       
                        let keyNum = 0;
                        let countNum = 0;
                        participants.forEach((item) => {
                            if (isOverlapping(item, resultArray, start, end)
                                && isOverSelected(item, limitArray[2])
                                && isSamePerson(item, resultArray, end)) {
                                countNum = 3;
                            } else if (isOverlapping(item, resultArray, start, end)
                                && isOverSelected(item, limitArray[2])) {
                                countNum = 2;
                            } else if (isOverlapping(item, resultArray, start, end)) {
                                countNum = 1;
                            } else {
                                countNum = 0;
                            }
                            if (keyNum < countNum) {
                                keyNum = countNum;
                            }
                        })

                        console.log('keyNum[' + String(end) + ']' + keyNum);

                        switch (keyNum) {
                            case 0:
                                alert('ラウンドを組めません');
                                break;
                            case 1:
                                while (Boolean(1 - isOverlapping(candidate, resultArray, start, end))) {
                                    candidate = participants[getRandomInt(participants.length)];
                                }
                                resultArray[end] = candidate;
                                candidate.howMany += 1;
                                pushWithWho(candidate, l, resultArray, end);
                                break;

                            case 2:
                                while (Boolean(1 - isOverlapping(candidate, resultArray, start, end)
                                * isOverSelected(candidate, limitArray[2]))) {
                                    candidate = participants[getRandomInt(participants.length)];
                                }
                                resultArray[end] = candidate;
                                candidate.howMany += 1;
                                pushWithWho(candidate, l, resultArray, end);
                                break;

                            case 3:
                                while (Boolean(1 - isOverlapping(candidate, resultArray, start, end)
                                * isOverSelected(candidate, limitArray[2])
                                * isSamePerson(candidate, resultArray, end))) {
                                    candidate = participants[getRandomInt(participants.length)];
                                }
                                resultArray[end] = candidate;
                                candidate.howMany += 1;
                                pushWithWho(candidate, l, resultArray, end);
                                break;
                        }

                    }
                }

            }
        }
    }

    return resultArray;
}



//関数showResult
//makeRoundで組んだラウンドを、'/result'に表示する関数
const showResult = () => {
    let resultArray = makeRound();

    for (let i = 0; i < resultArray.length; i++) {
        console.log('resultArray[' + String(i) + ']：' + resultArray[i]);
        document.getElementById(String(i)).innerHTML = resultArray[i].name + "<br>" + "回数：" + resultArray[i].howMany;  //td要素のコンテンツの書き換えができない！ここから続き！
    }
    
}

showResult();

