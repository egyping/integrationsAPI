import { formatJSONResponse } from "@libs/apiGateway";
import { APIGatewayProxyEvent } from "aws-lambda";
import * as path from "path";
import Axios from 'axios'


export const handler = async (event: APIGatewayProxyEvent) => {

    // business logic 
    // someUrl/gameDeals?currency=aed
    try {
        const { queryStringParameters = {} } = event
        const { currency } = queryStringParameters
        console.log(currency)

        // if statement to return error message if currency is not provided
        if (!currency) {
            return formatJSONResponse({
                statusCode: 400,
                data: {
                    message: "Missing the currency",
                }
            })
        }

        // https://www.cheapshark.com/api/1.0/deals?upperPrice=15&pageSize=5

        // create deals object which expose the API "https://www.cheapshark.com/api/1.0/deals?upperPrice=15&pageSize=5" and save it in the deals
        const deals = await Axios.get(
            `https://www.cheapshark.com/api/1.0/deals?upperPrice=15&pageSize=5`
            )    


        // `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/${currency}.json`
        // create currencyData which hit the API to get a conversion rate
        const currencyData = await Axios.get(
            //`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/${currency}.json`
            'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-03-02/v1/currencies/usd.json'
            )
        
        const currencyConversion = currencyData.data[currency]

        const repricedDeals = deals.data.map(
            (deal) =>
            {
                const { 
                    normalPrice, 
                    salePrice, 
                    title, 
                    storeID, 
                    dealID, 
                    savings, 
                    releaseDate,
                    steamRatingPercent,
                    } = deal

                    return {
                        title,
                        storeID,
                        steamRatingPercent,
                        

                        salePrice: salePrice * currencyConversion,
                        normalPrice: normalPrice * currencyConversion,
                        savings: savings,
                        releaseDate: new Date(releaseDate * 1000).toDateString(),
                    }
                
            })


        return formatJSONResponse({
            data: repricedDeals,
        }) 
    } catch (error) {
            console.log('error', error)
            return formatJSONResponse({
                statusCode: 502,
                data: {
                    message: error.message,
                },
            });
        }
}