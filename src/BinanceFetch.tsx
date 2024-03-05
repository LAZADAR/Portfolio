const BASE_URL = 'https://api.binance.com/api/v3';

export async function getAllSpotTradingPairsToUSDT(): Promise<string[]> {
  try {
    const response = await fetch(`${BASE_URL}/exchangeInfo`);
    if (!response.ok) {
      throw new Error('Failed to fetch trading pairs');
    }
    const data = await response.json();
    const tradingPairs: string[] = [];
    data.symbols.forEach((symbol: any) => {
      if (symbol.status === 'TRADING' && symbol.quoteAsset === 'USDT') {
        tradingPairs.push(symbol.symbol);
      }
    });
    return tradingPairs;
  } catch (error) {
    console.error('Error fetching trading pairs:', error);
    return [];
  }
}
export async function getSpotPriceForPair(
  symbol: string
): Promise<number | null> {
  try {
    const response = await fetch(`${BASE_URL}/ticker/price?symbol=${symbol}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch spot price for ${symbol}`);
    }

    const data = await response.json();
    const price = parseFloat(data.price);

    return price;
  } catch (error) {
    console.error(`Error fetching spot price for ${symbol}:`, error);
    return null;
  }
}
interface PriceData {
  price: string;
}
export interface DayChanges {
  [symbol: string]: {
    CurrentPrice: number;
    PriceChange: number;
    PercentChange: number;
  };
}

export async function getPriceChange(symbols: string[]): Promise<DayChanges> {
  const dayChanges: DayChanges = {};

  try {
    for (const symbol of symbols) {
      // Отримуємо поточну ціну
      const currentPriceResponse = await fetch(
        `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
      );
      const currentPriceData: PriceData = await currentPriceResponse.json();
      const currentPrice: number = parseFloat(currentPriceData.price);

      // Отримуємо ціну 24 години тому
      const endTime = Date.now();
      const startTime = endTime - 86400000; // 24 години у мілісекундах
      const klinesResponse = await fetch(
        `https://api.binance.com/api/v1/klines?symbol=${symbol}&interval=1d&startTime=${startTime}&endTime=${endTime}`
      );
      const klinesData = await klinesResponse.json();

      if (klinesData.length === 0) {
        throw new Error(`Немає даних за останні 24 години для ${symbol}`);
      }

      const pastPrice: number = klinesData[0][1]; // Ціна закриття першого свічки за останні 24 години

      // Розраховуємо зміну ціни
      const priceChange = {
        CurrentPrice: currentPrice,
        PriceChange: currentPrice - pastPrice,
        PercentChange: (currentPrice / pastPrice) * 100 - 100,
      };

      dayChanges[symbol] = priceChange;
    }

    return dayChanges;
  } catch (error) {
    throw new Error(`Помилка при отриманні зміни ціни: ${error}`);
  }
}
