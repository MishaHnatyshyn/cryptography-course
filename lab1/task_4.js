const {getKeyLength} = require('../lab1/task_2')
const { generateInitialPopulation, selection, crossover, calculateScore, UPPER_CASE_ALPHABET } = require('../lab1/task_3');

const GENERATIONS_COUNT = 500;
const POPULATION_SIZE = 100;

const text = 'KZBWPFHRAFHMFSNYSMNOZYBYLLLYJFBGZYYYZYEKCJVSACAEFLMAJZQAZYHIJFUNHLCGCINWFIHHHTLNVZLSHSVOZDPYSMNYJXHMNODNHPATXFWGHZPGHCVRWYSNFUSPPETRJSIIZSAAOYLNEENGHYAMAZBYSMNSJRNGZGSEZLNGHTSTJMNSJRESFRPGQPSYFGSWZMBGQFBCCEZTTPOYNIVUJRVSZSCYSEYJWYHUJRVSZSCRNECPFHHZJBUHDHSNNZQKADMGFBPGBZUNVFIGNWLGCWSATVSSWWPGZHNETEBEJFBCZDPYJWOSFDVWOTANCZIHCYIMJSIGFQLYNZZSETSYSEUMHRLAAGSEFUSKBZUEJQVTDZVCFHLAAJSFJSCNFSJKCFBCFSPITQHZJLBMHECNHFHGNZIEWBLGNFMHNMHMFSVPVHSGGMBGCWSEZSZGSEPFQEIMQEZZJIOGPIOMNSSOFWSKCRLAAGSKNEAHBBSKKEVTZSSOHEUTTQYMCPHZJFHGPZQOZHLCFSVYNFYYSEZGNTVRAJVTEMPADZDSVHVYJWHGQFWKTSNYHTSZFYHMAEJMNLNGFQNFZWSKCCJHPEHZZSZGDZDSVHVYJWHGQFWKTSNYHTSZFYHMAEDNJZQAZSCHPYSKXLHMQZNKOIOKHYMKKEIKCGSGYBPHPECKCJJKNISTJJZMHTVRHQSGQMBWHTSPTHSNFQZKPRLYSZDYPEMGZILSDIOGGMNYZVSNHTAYGFBZZYJKQELSJXHGCJLSDTLNEHLYZHVRCJHZTYWAFGSHBZDTNRSESZVNJIVWFIVYSEJHFSLSHTLNQEIKQEASQJVYSEVYSEUYSMBWNSVYXEIKWYSYSEYKPESKNCGRHGSEZLNGHTSIZHSZZHCUJWARNEHZZIWHZDZMADNGPNSYFZUWZSLXJFBCGEANWHSYSEGGNIVPFLUGCEUWTENKCJNVTDPNXEIKWYSYSFHESFPAJSWGTYVSJIOKHRSKPEZMADLSDIVKKWSFHZBGEEATJLBOTDPMCPHHVZNYVZBGZSCHCEZZTWOOJMBYJSCYFRLSZSCYSEVYSEUNHZVHRFBCCZZYSEUGZDCGZDGMHDYNAFNZHTUGJJOEZBLYZDHYSHSGJMWZHWAFTIAAY';

const decode = (text, keys) => text.split('').map((letter, index) => UPPER_CASE_ALPHABET[keys[index % keys.length].indexOf(letter)]).join('');


const generateInitialPopulations = (size, alphabetsCount) => {
    return [...new Array(alphabetsCount)].map(() => generateInitialPopulation(size))
}

const fitness = (population, text, keys, index) => {
    population.forEach((variant) => {
        const variantsKeys = [...keys];
        variantsKeys[index] = variant.key;
        const decodedText = decode(text, variantsKeys)

        variant.score = calculateScore(decodedText);
    })
}

const getKey = (text) => {
    const alphabetsCount = getKeyLength(text);
    let currentPopulations = generateInitialPopulations(POPULATION_SIZE, alphabetsCount);
    for (let i = 0; i < GENERATIONS_COUNT; i++) {
        const keys = currentPopulations.map((population) => population.sort((a, b) => a.score - b.score)[0].key)
        currentPopulations = currentPopulations.map((population, index) => {
            fitness(population, text, keys, index);
            const selectedPopulation = selection(population);

            while (selectedPopulation.length < POPULATION_SIZE) {
                crossover(selectedPopulation);
            }

            return selectedPopulation;
        })
    }

    return currentPopulations.map(population => population.sort((a, b) => a.score - b.score)[0].key);
}





const key = getKey(text);
console.log('KEY: ', key);
decode(text, key);

