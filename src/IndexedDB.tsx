import { openDB, DBSchema, IDBPDatabase } from 'idb';
export interface transaction {
  date: number;
  price: number;
  quantity: number;
}
export interface token {
  id: string;
  buyPrice: number;
  quantity: number;
  changes: {
    DayPercent: number;
    DayPrice: number;
  };
  currentPrice: number;
  transactions: transaction[];
}
export interface Portfolio {
  id: string;
  name: string;
  Tokens?: token[];
}

interface PortfolioDB extends DBSchema {
  portfolios: {
    key: string;
    value: Portfolio;
  };
}

export default class IndexedDBService {
  static async getDatabase(): Promise<IDBPDatabase<PortfolioDB>> {
    return openDB<PortfolioDB>('portfolios-store', 1, {
      upgrade(db) {
        db.createObjectStore('portfolios', {
          keyPath: 'id',
        });
      },
    });
  }
  static async addPortfolio(name: string, id: string): Promise<void> {
    const db = await this.getDatabase();
    const portfolio = { id: id, name: name, Tokens: [] };
    await db.add('portfolios', portfolio);
  }
  static async getPortfolio(id: string): Promise<Portfolio | undefined> {
    const db = await this.getDatabase();
    return db.get('portfolios', id);
  }
  static async updatePortfolio(portfolio: Portfolio): Promise<void> {
    const db = await this.getDatabase();
    await db.put('portfolios', portfolio);
  }
  static async AddToken(portfolioID: string, token: token): Promise<void> {
    try {
      if (token.id.length && token.buyPrice && token.quantity) {
        const db = await this.getDatabase();
        const portfolio = await db.get('portfolios', portfolioID);

        if (portfolio && portfolio.Tokens) {
          const includes = portfolio.Tokens.find((el) => el.id === token.id);
          if (includes) {
            const totalquantity = includes.quantity + token.quantity;
            const totalprice = parseFloat(
              (
                includes.buyPrice * includes.quantity +
                token.buyPrice * token.quantity
              ).toFixed(2)
            );
            includes.buyPrice = totalprice / totalquantity;
            includes.quantity = totalquantity;
            includes.transactions.push({
              date: new Date(Date.now()).getTime(),
              price: token.buyPrice,
              quantity: token.quantity,
            });
            await db.put('portfolios', portfolio);
          } else {
            portfolio.Tokens.push({
              id: token.id,
              buyPrice: token.buyPrice,
              quantity: token.quantity,
              changes: {
                DayPercent: 0,
                DayPrice: 0,
              },
              currentPrice: 0,
              transactions: [
                {
                  date: new Date(Date.now()).getTime(),
                  price: token.buyPrice,
                  quantity: token.quantity,
                },
              ],
            });
            await db.put('portfolios', portfolio);
          }
        } else {
          throw new Error('Portfolio or Tokens not found.');
        }
      } else {
        throw new Error('Invalid token information provided.');
      }
    } catch (error) {
      console.error('Error adding token:', error);
      throw error;
    }
  }

  static async deletePortfolio(id: string): Promise<void> {
    const db = await this.getDatabase();
    await db.delete('portfolios', id);
  }
  static async getAllPortfoliosName(): Promise<Portfolio[]> {
    const db = await this.getDatabase();
    const todos = await db.getAll('portfolios');
    const result: Portfolio[] = [];
    todos.forEach((el) => result.push({ id: el.id, name: el.name }));
    return result;
  }
}
