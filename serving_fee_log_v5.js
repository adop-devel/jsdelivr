const dataSet = {
    ad_date: '20250108030327',
    acid: '-',
    ctry: 'KR',
    ip: '61.38.79.26',
    url: dataZoneName,
    net: '',
    ad_direction: 'v',
    ad_full_loc: '',
    area_idx: '',
    aid: '',
    log_type: 'serving_fee',
    tp: '0',
    fp: '0'
};

const getTopWindow = (currentWindow = window) => {
    try {
        if ( currentWindow.document.cookie?.includes('ADOP_CID') ) {
            console.log('find acid !');
            return currentWindow;
        }
        // 현재 윈도우의 parent가 자신인지 확인 (최상단 여부 판단)
        if ( currentWindow.parent === currentWindow ) {
            return currentWindow; // 최상단 window
        }
        // 부모 window를 재귀적으로 호출
        return getTopWindow(currentWindow.parent);
    } catch (error) {
        // CORS 또는 보안 오류 발생 시 현재 window 반환
        console.error("Unable to access parent window due to cross-origin restrictions:", error);
        return currentWindow;
    }
}

const getACID = () => {
    const topWindow = getTopWindow();
    const cookies = topWindow.document.cookie.split(' ');
    const length = cookies.length;
    let acid;
    console.log('cookies = ', cookies);
    for ( let index = 0; index < length; index++ ) {
        const key = cookies[index].split('=')[0];
        const value = cookies[index].split('=')[1];
        if ( key === 'ADOP_CID' ) {
            acid = value;
            break;
        }
    }

    return acid ?? topWindow.localStorage.getItem('ADOP_CID');
}

function request_ad() {
    dataSet.tp = '1';
    dataSet.acid = getACID();
    console.log('acid = ', dataSet.acid);
    if ( !dataSet.acid )
        console.log('can not find acid!')
}

function impression_ad() {
    dataSet.ref = '1';
}

function createImageTag() {
    try {
        const url = '//data.adop.cc/collect.php?data=' + encodeURIComponent((btoa(JSON.stringify(dataSet))));
        const img = document.createElement('img');
        img.src = url;
        img.width = "1px";
        img.height = "1px";
        img.style.cssText = "position:absolute; top:-100; left:-100;";
        document.body.appendChild(img);
    } catch (e) {
        console.error('error during createImageTag ', e);
    }
}
