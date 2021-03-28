//参加者選択
//jQueryで実装（といいつつほとんどJavaScriptな気もする）。
$(() => {
    const CHECKED_CLASS = 'checked';
    let 
        checkedID_array = [],
        ltem_count = 0,
        for_count = 0,
        check_text = '',
        e_target = []
    ;

    //オブジェクト代入パートの変数
    //Participantクラスを定義
    class Participant{
        constructor(id, name, gender, grade) {
            this.id = id;
            this.name = name;
            this.gender = gender;
            this.grade = grade;
        }

    }

    //配列変数participantsはselect.ejsにグローバル変数として定義。
    let 
        // participants = [],   ：グローバル変数として定義済
        participant,
        participantID,
        participantName,
        participantGender,
        participantGrade,
        i = 0
    ;
    //ここまで追加。後で消すかも。

    $('.list_item').on('click', (e) => {
        e_target = $(e.currentTarget);//クリックするたびに、配列e_targetは初期化されている。要素の追加ではない。
        e_target.toggleClass(CHECKED_CLASS);
        //checkedが付与されている項目のidを配列に追加、ない項目は配列から除去
        if(e_target.hasClass(CHECKED_CLASS)){
            checkedID_array.push(e_target.attr('id'));

            //オブジェクト代入パート
            //まじで自信ない。
            //選択されたメンバーの名前、性別、学年でインスタンスを生成したい。
            participantID = parseInt($(e.currentTarget).find('.id-column').text());
            participantName = $(e.currentTarget).find('.name-column').text();
            participantGender = parseInt($(e.currentTarget).find('.gender-column').text());
            participantGrade = parseInt($(e.currentTarget).find('.grade-column').text());
            //participantオブジェクトを定義
            participant = new Participant(participantID, participantName, participantGender,participantGrade);
            //配列participantsにparticipantオブジェクトを代入
            participants[i] = participant;   
            //ここまで追加。後で消すかも。
            i += 1;
        } else {
            for_count = 0;
            for(; for_count < ltem_count; for_count++) {
                if (e_target.attr('id') === checkedID_array[for_count]) {
                    checkedID_array.splice(for_count, 1);

                    //オブジェクト代入パート
                    participants.splice(for_count, 1);
                    //後で消すかも
                    i -= 1;
                }
            }
        }

        //participantsを別ファイルでも使えるようにエクスポート
        //-->失敗

        //ここにローカルストレージへのparticipantsの保存を書きたい。
        //-->成功・採用

        //jsonデータにしてmakeround.jsからアクセスする方法を試す。
        //-->失敗
        

        //オブジェクト代入パート確認用
        console.log(participants);
        for (let j = 0; j < participants.length; j++) {
            console.log(participants[j]);
        }

        //画面に選択されている項目を表示させる
        ltem_count = checkedID_array.length;
        for_count = 0;
        check_text = '';
        for (; for_count < ltem_count; for_count++) {
            //最初の一つ目以降は前に , を付けて区切る
            if (for_count !== 0) {check_text += ','}
            check_text += checkedID_array[for_count];
        }
        $('#check_item').text(check_text);

        //ローカルストレージにparticipantsを保存してみる。
        


        //オブジェクトのデータを元に参加者を表示する。
        //定数や変数の定義
        const PARTICIPANT_TABLE_BODY = document.getElementById('participant-table-body');   //ul要素
        let
            participantList,    //div要素
            participantDiv,     //div要素
            //span要素の中身
            participantIDContent,
            participantNameContent,
            participantGenderContent,
            participantGradeContent
        ;

        //ul要素（participant-table-body）の中身をリセット
        let child_nodes_count = PARTICIPANT_TABLE_BODY.childElementCount;

        for (let k = 0; k < child_nodes_count; k++) {
            PARTICIPANT_TABLE_BODY.children[child_nodes_count - 1 - k].remove();
        }

        //テスト
        console.log('participantsの配列長：' + participants.length);
        
        
        for (let l = 0; l < participants.length; l++) {
            //テスト
            console.log('participants[' + String(l) + ']：' + participants[l]);

            participantList = document.createElement('div');
            //divタグ
            participantDiv = document.createElement('div');

            //spanタグの中身
            // participantIDContent = document.createElement('span');
            participantNameContent = document.createElement('span');
            participantGenderContent = document.createElement('span');
            participantGradeContent = document.createElement('span');

            //spanタグにclassを設定
            // participantIDContent.setAttribute('class', 'participant-id-column');
            participantNameContent.setAttribute('class', 'participant-name-column');
            participantGenderContent.setAttribute('class', 'participant-gender-column');
            participantGradeContent.setAttribute('class', 'participant-grade-column');
            //spanタグにidを設定
            // participantIDContent.setAttribute('id', 'participant-id-column-'+String(participants[l].id));
            participantNameContent.setAttribute('id', 'participant-name-column-'+String(participants[l].id));
            participantGenderContent.setAttribute('id', 'participant-gender-column-'+String(participants[l].id));
            participantGradeContent.setAttribute('id', 'participant-grade-column-'+String(participants[l].id));
            //spantタグに内容を追加
            // participantIDContent.textContent = String(participants[l].id);
            participantNameContent.textContent = participants[l].name;
            participantGenderContent.textContent = String(participants[l].gender);
            participantGradeContent.textContent = String(participants[l].grade);
            
            //div要素にspan要素を追加
            // participantDiv.appendChild(participantIDContent);
            participantDiv.appendChild(participantNameContent);
            participantDiv.appendChild(participantGenderContent);
            participantDiv.appendChild(participantGradeContent);
            
            //li要素にdiv要素を追加
            participantList.appendChild(participantDiv);

            
            //ul要素にli要素を追加
            PARTICIPANT_TABLE_BODY.appendChild(participantList);
        }

    });

});



//ラウンドについて
//ラウンド追加
let i = 0;
const ROUND_RULE = document.getElementById('round-rule');
const addRound = () => {
    i++;
    //divタグを用意してクラスとIDを設定
    const ROUND_SET = document.createElement('div');
    ROUND_SET.setAttribute('class', 'round-set');
    ROUND_SET.setAttribute('id', 'round-set-'+String(i));
    //selectタグを用意
    const SELECT = document.createElement('select');
    SELECT.setAttribute('id', 'gender-ratio-' + String(i));
    //optionタグを用意してvalueとtextを設定
    const 
        OPTION_0 = document.createElement('option'),
        OPTION_1 = document.createElement('option'),
        OPTION_2 = document.createElement('option'),
        OPTION_3 = document.createElement('option'),
        OPTION_4 = document.createElement('option'),
        OPTION_5 = document.createElement('option')
    ;
    
    OPTION_0.value = 0; 
    OPTION_1.value = 1; 
    OPTION_2.value = 2; 
    OPTION_3.value = 3; 
    OPTION_4.value = 4; 
    OPTION_5.value = 5; 

    OPTION_0.text = '男4女0';
    OPTION_1.text = '男3女1';
    OPTION_2.text = '男2女2';
    OPTION_3.text = '男1女3';
    OPTION_4.text = '男0女4';
    OPTION_5.text = '条件なし';

    //select要素にoption要素を追加
    SELECT.appendChild(OPTION_0);
    SELECT.appendChild(OPTION_1);
    SELECT.appendChild(OPTION_2);
    SELECT.appendChild(OPTION_3);
    SELECT.appendChild(OPTION_4);
    SELECT.appendChild(OPTION_5);

    //round-setにselectを追加
    ROUND_SET.appendChild(SELECT);

    //「が」、ラウンド数、「ラウンド」といったつなぎ
    const
        SPAN_GA = document.createElement('span');
        SPAN_RAUNDO = document.createElement('span');
        ROUND_NUM = document.createElement('input');
        ROUND_REMOVE = document.createElement('input');
    ;
    
    //各ラウンドセットのラウンド数のinput要素にidを付ける。例）round-num-0
    ROUND_NUM.setAttribute('id', 'round-num-' + String(i));

    SPAN_GA.textContent = ' が ';
    SPAN_RAUNDO.textContent = ' ラウンド ';
    ROUND_NUM.type = ('number');
    ROUND_NUM.min = ('1');
    ROUND_NUM.max = ('100');

    ROUND_REMOVE.setAttribute('id', 'remove-RSbutton-' + String(i));
    ROUND_REMOVE.setAttribute('class', 'remove-RSbutton');
    ROUND_REMOVE.type = ('button');
    ROUND_REMOVE.value = ('削除');

    //つなぎをround-setに追加
    ROUND_SET.appendChild(SPAN_GA);
    ROUND_SET.appendChild(ROUND_NUM);
    ROUND_SET.appendChild(SPAN_RAUNDO);
    ROUND_SET.appendChild(ROUND_REMOVE);

    //idがround-ruleのdiv要素の末尾に新たなround-setを追加
    ROUND_RULE.appendChild(ROUND_SET);

    //動的に追加された削除ボタンがクリックされたときの処理は、追加する処理の中で一緒に定義するとうまくいくみたい。
    //このままでは、削除ボタンだけidが飛び飛びの値だから、idを振り直す必要が……まあ振り直さなくても困らないけど、振り直せるなら振り直したい。
    const removeRSBtn = Array.from(document.getElementsByClassName('remove-RSbutton'));
    removeRSBtn.forEach(element => {
        console.log(element);
        element.addEventListener('click', () => {
            element.parentNode.remove();
        });
    });


    //ここまでテスト


    //テスト用
    console.log('クリックされた！');
}




//ラウンド情報
//JavaScriptで実装
class Round {
    constructor(ratio, numOfRound) {
        this.ratio = ratio;
        this.numOfRound = numOfRound;
    }
}

//

const addRoundData = () => {
    let
        // roundSetData = []　←select.jsに定義済
        roundSet = Array.prototype.slice.call(document.getElementsByClassName('round-set')),   
        roundSetNum = roundSet.length,   
        round,
        ratio,
        numOfRound
    ;

    console.log('roundSetNumの値：' + roundSetNum);
    for (let i = 0; i < roundSetNum; i++) {
        //配列ROUND_SET_RULESに配列の情報を格納する。
        //選択されたoptionだけを限定して取得する
        ratio = parseInt(roundSet[i].children[0].value);
        numOfRound = parseInt(roundSet[i].children[2].value)
        
        //ratioとroundNumの確認
        console.log('男女比：' + ratio);
        console.log('ラウンド数：' + numOfRound);

        round = new Round(ratio, numOfRound);
        roundSetData.push(round);
    }
}

//必要な情報が入力されているかチェックする関数
const checkData = () => {
    let courtNum = document.getElementById('court-num').value;
    let key = false;
    let roundNumSelect = document.getElementsByClassName('round-num');
    let roundNumArray = Array.prototype.slice.call(roundNumSelect);

    const voidRoundNum = () => {
        //結局空の要素が''なのかundefinedなのかわからないのでorで妥協。
        roundNumArray.some(value => ((value === '') || (value === undefined)));
    }

    if ((courtNum === '') || (participants.length === 0) || (voidRoundNum())) {
        //後で、ラウンド数が入力されているかもチェックする。
        return key;
    } else {
        key = true;
        return key;
    }
}

//ラウンドを組むために必要な最低限の人数条件を満たしているか確認する関数
const judgeShortage = () => {
    let key = false;
    
    let
        courtNum = document.getElementById('court-num').value,
        //男の人数、女の人数をparticipants.genderを元に計算
        maleNum = 0,
        femaleNum = 0,
        //比率の男女別最大値
        maxMaleRatio = 0,
        maxFemaleRatio = 0,
        //各ラウンドセットについて、ratio * courtNumが必要な女の人数で(4-ratio) * courtNumが必要な男の人数
        minMaleNum = 0,
        minFemaleNum = 0
    ;
    
    //participantsの男女別人数を計算
    participants.forEach((participant) => {
        if (participant.gender === 1) {
            maleNum += 1;
        } else {
            femaleNum += 1;
        }
    });

    //最低限必要な男女別人数を計算
    const 
        genderRatioSelect = document.getElementsByClassName('gender-ratio'),    //[Object HTMLCollection]
        genderRatioSelectValue = document.getElementsByClassName('gender-ratio').value, //テスト
        genderRatioSelectArray = Array.prototype.slice.call(genderRatioSelect), //[Object HTMLSelectElement]
        genderRatioArray = []
    ;

    //テスト
    console.log('genderRatioSelect:' + genderRatioSelect);  //[Object HTMLCollection]
    console.log('genderRatioSelectValue:' + genderRatioSelectValue);    //undefined
    console.log('genderRatioSelectArray:' + genderRatioSelectArray);    //[Object HTMLSelectElement]
    console.log('genderRatioSelectArray.value:' + genderRatioSelectArray.value);    //undefined
    console.log('genderRatioSelectArray[0].value:' + genderRatioSelectArray[0].value);    //

    genderRatioSelectArray.forEach((item) => {
        genderRatioArray.push(parseInt(item.value));
    });

    // console.log('genderRatioArray:' + genderRatioArray); //テスト
    // console.log('genderRatioArray[0]:' + genderRatioArray[0]); //テスト
    // console.log('genderRatioArray[1]:' + genderRatioArray[1]); //テスト
    // console.log('genderRatioArray.length:' + genderRatioArray.length); //テスト

    for (let i = 0; i < genderRatioArray.length; i++) {
        if (genderRatioArray[i] !== 5) {
            if (maxMaleRatio < (4-genderRatioArray[i])) {
                maxMaleRatio = 4-genderRatioArray[i];
            }
            if (maxFemaleRatio < genderRatioArray[i]) {
                maxFemaleRatio = genderRatioArray[i];
                // console.log('何故か実行されたよ？');
                // console.log(genderRatioArray[i] !== 5);
                // console.log('i:' + i);
                // console.log('genderRatioArray[i]の型:' + typeof genderRatioArray[i]);   //型確認、だいじ。
            }
        }
    }

    minMaleNum = courtNum * maxMaleRatio;
    minFemaleNum = courtNum * maxFemaleRatio;

    console.log('minMaleNum:' + minMaleNum);    //テスト
    console.log('minFemalNum:' + minFemaleNum); //テスト
    console.log('participants.length:' + participants.length);  //テスト
    console.log('maleNum:' + maleNum);  //テスト
    console.log('femaleNum:' + femaleNum);  //テスト

    if (participants.length >= (4*courtNum)) {
        if ((maleNum >= minMaleNum) && (femaleNum >= minFemaleNum)) {
            key = true;
            return key;
        } else {
            return key;
        }
    } else {
        return key;
    }
}


//ここから再開！！！
//メンバー検索機能の実装
//jQueryで実装。
$(function () {
    searchWord = function() {
        let
            searchText = $(this).val(),
            targetText
        ;
    
        if(searchText != '') {
            $('.list_item').each(function() {
                targetText = $(this).find('.name-column').text();
    
                if (targetText.indexOf(searchText) != -1) {
                    $(this).removeClass('hidden');
                } else {
                    $(this).addClass('hidden');
                }
            });
        } else {
            $('.list_item').each(function() {
                $(this).removeClass('hidden');
            });
        }
    }
    
    $('#search-text').on('input', searchWord);
});