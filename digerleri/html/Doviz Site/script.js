const leftContainer = document.querySelector('.left-container');
const rightContainer = document.querySelector('.right-container');

const apiUrlCryptoBTC = 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=TRY';
const apiUrlCryptoETH = 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=TRY';
const apiUrlCryptoDOGE = 'https://min-api.cryptocompare.com/data/price?fsym=DOGE&tsyms=TRY';
const apiUrlCryptoSUI = 'https://min-api.cryptocompare.com/data/price?fsym=SUI&tsyms=TRY';
const apiUrlForex = 'https://api.exchangerate-api.com/v4/latest/TRY';

let previousPrices = {}; // Önceki fiyatları saklamak için

async function fetchCryptoData() {
    try {
        const responseBTC = await fetch(apiUrlCryptoBTC);
        const dataBTC = await responseBTC.json();

        const responseETH = await fetch(apiUrlCryptoETH);
        const dataETH = await responseETH.json();

        const responseDOGE = await fetch(apiUrlCryptoDOGE);
        const dataDOGE = await responseDOGE.json();

        const responseSUI = await fetch(apiUrlCryptoSUI);
        const dataSUI = await responseSUI.json();

        const responseForex = await fetch(apiUrlForex);
        const dataForex = await responseForex.json();

        leftContainer.innerHTML = '';
        rightContainer.innerHTML = '';

        const assetNames = {
            BTC: 'Bitcoin',
            ETH: 'Ethereum',
            DOGE: 'Dogecoin',
            SUI: 'SUI Network',
            USD: 'Dolar',
            EUR: 'Euro'
        };

        const assetEmojis = {
            BTC: '🐜',
            ETH: '🔶',
            DOGE: '🐶',
            SUI: '💻',
            USD: '💵',
            EUR: '💶'
        };

        Object.keys(assetNames).forEach(asset => {
            let priceTry;

            if (asset === 'BTC') priceTry = dataBTC.TRY;
            else if (asset === 'SUI') priceTry = dataSUI.TRY;
            else if (asset === 'ETH') priceTry = dataETH.TRY;
            else if (asset === 'DOGE') priceTry = dataDOGE.TRY;
            else if (asset === 'USD' && dataForex.rates['USD']) priceTry = 1 / dataForex.rates['USD'];
            else if (asset === 'EUR' && dataForex.rates['EUR']) priceTry = 1 / dataForex.rates['EUR'];

            if (priceTry) {
                const formattedPrice = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(priceTry);

                let trendClass = 'neutral'; // Varsayılan olarak değişim yok
                let trendEmoji = '➖'; // Varsayılan emoji

                if (previousPrices[asset] !== undefined) {
                    if (priceTry > previousPrices[asset]) {
                        trendClass = 'rising';
                        trendEmoji = '🔺';
                    } else if (priceTry < previousPrices[asset]) {
                        trendClass = 'falling';
                        trendEmoji = '🔻';
                    }
                }

                previousPrices[asset] = priceTry; // Yeni fiyatı kaydet

                const assetElement = document.createElement('div');
                assetElement.classList.add('coin', trendClass);
                assetElement.innerHTML = `
                    <div class="coin-logo">
                        <h2>${assetEmojis[asset]}</h2>
                    </div>
                    <div class="coin-name">
                        <a href="#"><h3>${assetNames[asset]}</h3></a>
                    </div>
                    <div class="coin-price">
                        <span class="price"> ₺${formattedPrice} ${trendEmoji}</span>
                    </div>
                
                `;

                if (['BTC', 'ETH', 'DOGE', 'SUI'].includes(asset)) {
                    leftContainer.appendChild(assetElement);
                } else {
                    rightContainer.appendChild(assetElement);
                }
            }
        });

    } catch (error) {
        console.error('Error fetching asset data:', error);
    }
}

fetchCryptoData();
setInterval(fetchCryptoData, 10000);
