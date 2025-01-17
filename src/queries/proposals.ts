import { processRequest } from '../utils/graphql';

export const getAllProposalsByServiceId = (chainId: number, id: string): Promise<any> => {
  const query = `
    {
      proposals(where: {service_: {id: "${id}"}}) {
        service {
          id,
          cid
          buyer {
            id
          }
          platform {
            id
          }
        }
        cid
        id
        status
        rateToken {
          address
          decimals
          name
          symbol
        }
        rateAmount
        createdAt
        updatedAt
        seller {
          id
          handle
          address
          cid
          rating
          userStats {
            numReceivedReviews
          }
        }
        description {
          id
          about
          expectedHours
          startDate
          video_url
        }
        expirationDate
        platform {
          id
        }
      }
    }
    `;
  return processRequest(chainId, query);
};

export const getAllProposalsByUser = (chainId: number, id: string): Promise<any> => {
  const query = `
      {
        proposals(where: {seller: "${id}", status: "Pending"}) {
          id
          rateAmount
          rateToken {
            address
            decimals
            name
            symbol
          }
          status
          cid
          createdAt
          seller {
            id
            handle
          }
          service {
            id
            cid
            createdAt
            buyer {
              id
              handle
            }
          }
          description {
            id
            about
            expectedHours
            startDate
            video_url
          }
          expirationDate
        }
      }
    `;
  return processRequest(chainId, query);
};

export const getProposalById = (chainId: number, id: string): Promise<any> => {
  const query = `
      {
        proposals(where: {id: "${id}"}) {
          service {
            id,
            cid
            buyer {
              id
            }
            platform {
              id
            }
            description {
              title
            }
          }
          cid
          id
          status
          rateToken {
            address
            decimals
            name
            symbol
          }
          rateAmount
          createdAt
          updatedAt
          seller {
            id
            handle
            address
            cid
            rating
            userStats {
              numReceivedReviews
            }
          }
          description {
            id
            about
            expectedHours
            startDate
            video_url
          }
          expirationDate
          platform {
            id
          }
        }
      }
    `;
  return processRequest(chainId, query);
};
