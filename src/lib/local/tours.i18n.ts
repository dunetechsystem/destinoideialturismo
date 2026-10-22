import type { Locale } from "@/i18n/config";

/** Textos dos passeios locais por idioma (vindos do site antigo da agência). Chave = slug do passeio. */
export interface LocalTourText {
  title: string;
  tag: string;
  /** Horário em texto livre, ex.: "9h às 13h". */
  schedule: string;
  description: string;
  itinerary: string[];
  whatToBring: string[];
  note?: string;
}

export const LOCAL_TOUR_TEXT: Record<Locale, Record<string, LocalTourText>> = {
  "pt": {
    "lagoa-azul": {
      "title": "Circuito Lagoa Azul",
      "tag": "Mais procurado",
      "schedule": "9h às 13h",
      "description": "Travessia de 4x4 até as lagoas mais famosas, banho nas águas verdes e caminhada pelas dunas. O clássico dos Lençóis.",
      "itinerary": [
        "Saída da agência em Barreirinhas em 4x4 por volta das 9h",
        "Travessia de cerca de 40 min até o portal dos Lençóis",
        "Caminhada pelas dunas até a Lagoa do Peixe e Lagoa Azul",
        "Tempo livre para banho e fotos nas lagoas",
        "Parada em lagoas adicionais conforme roteiro do dia",
        "Retorno a Barreirinhas por volta das 13h"
      ],
      "whatToBring": [
        "Protetor solar",
        "Roupa de banho",
        "Toalha",
        "Água",
        "Chapéu/boné",
        "Óculos de sol",
        "Dinheiro para extras"
      ]
    },
    "lagoa-bonita": {
      "title": "Circuito Lagoa Bonita",
      "tag": "Golden Hour",
      "schedule": "Saída 14h com pôr do sol",
      "description": "Saída no fim da tarde para curtir o espetáculo dourado sobre a Lagoa Bonita. Luz perfeita para fotos e caminhada leve.",
      "itinerary": [
        "Saída da agência em Barreirinhas por volta das 14h",
        "Travessia de 4x4 até a base da Lagoa Bonita",
        "Caminhada guiada de aproximadamente 20 min até a lagoa",
        "Tempo livre para banho e contemplação",
        "Subida ao mirante para o pôr do sol panorâmico",
        "Retorno a Barreirinhas após o entardecer"
      ],
      "whatToBring": [
        "Protetor solar",
        "Roupa de banho",
        "Toalha",
        "Água",
        "Chapéu/boné",
        "Câmera/filmadora",
        "Repelente",
        "Lanterna para o retorno"
      ]
    },
    "duas-lagoas": {
      "title": "Duas Lagoas — Azul e Bonita",
      "tag": "Dia completo",
      "schedule": "Saída 9h com pôr do sol",
      "description": "O roteiro mais completo: Lagoa Azul de manhã e Lagoa Bonita à tarde, fechando com o pôr do sol nas dunas.",
      "itinerary": [
        "Saída da agência em Barreirinhas por volta das 9h",
        "Manhã: Circuito Lagoa Azul com banho e caminhada",
        "Almoço livre em Barreirinhas (não incluso)",
        "Tarde: saída para a Lagoa Bonita",
        "Pôr do sol no mirante da Lagoa Bonita",
        "Retorno a Barreirinhas após o entardecer"
      ],
      "whatToBring": [
        "Protetor solar",
        "Roupa de banho",
        "Toalha",
        "Água (2L)",
        "Lanche para o dia",
        "Chapéu/boné",
        "Câmera",
        "Repelente",
        "Lanterna"
      ]
    },
    "atins": {
      "title": "Circuito Atins",
      "tag": "Aventura",
      "schedule": "9h às 17h",
      "description": "Descida até Atins, praias desertas e lagoas escondidas entre dunas litorâneas. Dia inteiro de exploração.",
      "itinerary": [
        "Saída da agência em Barreirinhas por volta das 9h",
        "Travessia de 4x4 até a vila de Atins",
        "Caminhada pelas dunas litorâneas e lagoas escondidas",
        "Visita às praias desertas do litoral",
        "Almoço típico em Atins (não incluso)",
        "Retorno a Barreirinhas por volta das 17h"
      ],
      "whatToBring": [
        "Protetor solar",
        "Roupa de banho",
        "Toalha",
        "Água (2L)",
        "Lanche",
        "Chapéu/boné",
        "Câmera",
        "Dinheiro para almoço"
      ]
    },
    "rio-preguicas-cabure": {
      "title": "Circuito Rio Preguiça & Caburé",
      "tag": "Ribeirinho",
      "schedule": "8h30 às 15h30",
      "description": "Passeio de voadeira pelo Rio Preguiças até Caburé — onde o rio encontra o mar. Encontro de águas e dunas litorâneas.",
      "itinerary": [
        "Embarque no porto de Barreirinhas por volta das 8h30",
        "Navegação pelo Rio Preguiças em voadeira",
        "Parada em Vassouras (pequenos lençóis ribeirinhos)",
        "Continuação até a foz do rio em Caburé",
        "Tempo livre na praia e no encontro rio/mar",
        "Almoço em Caburé (não incluso) e retorno às 15h30"
      ],
      "whatToBring": [
        "Protetor solar",
        "Roupa de banho",
        "Toalha",
        "Água",
        "Chapéu/boné",
        "Câmera",
        "Dinheiro para almoço",
        "Repelente"
      ]
    },
    "boia-cross": {
      "title": "Boia Cross",
      "tag": "Diversão",
      "schedule": "8h30 às 13h00",
      "description": "Descida pelo Rio Preguiças em boias individuais, com corredeiras leves e paisagens ribeirinhas. Aventura aquática para todos.",
      "itinerary": [
        "Saída da agência em Barreirinhas por volta das 8h30",
        "Travessia de 4x4 até o ponto de embarque no rio",
        "Descida pelo Rio Preguiças em boias individuais",
        "Paradas em praias fluviais e corredeiras leves",
        "Tempo de natação e descanso no percurso",
        "Retorno a Barreirinhas por volta das 13h"
      ],
      "whatToBring": [
        "Protetor solar",
        "Roupa de banho",
        "Toalha",
        "Água",
        "Chinelo/calçado aquático",
        "Repelente",
        "Roupa leve para o retorno"
      ]
    },
    "nascer-do-sol": {
      "title": "Nascer do Sol nas Dunas",
      "tag": "Exclusivo",
      "schedule": "4h30 às 7h00",
      "description": "Experimente a magia dos Lençóis Maranhenses ao amanhecer. O silêncio das dunas, os primeiros raios de luz dourada sobre as lagoas e um espetáculo que pouquíssimos visitantes têm o privilégio de ver.",
      "itinerary": [
        "Saída da agência às 4h30 da manhã em 4x4",
        "Travessia noturna pelas trilhas dos Lençóis com guia experiente",
        "Chegada ao ponto panorâmico antes do nascer do sol",
        "Contemplação do amanhecer sobre as dunas brancas e lagoas",
        "Registros fotográficos com a luz dourada dos primeiros raios",
        "Retorno a Barreirinhas por volta das 7h00"
      ],
      "whatToBring": [
        "Agasalho leve (madrugada fria nas dunas)",
        "Câmera/celular com bateria cheia",
        "Água",
        "Lanterna",
        "Calçado fechado",
        "Repelente"
      ]
    },
    "mirar-das-estrelas": {
      "title": "Mirar das Estrelas",
      "tag": "Noturno",
      "schedule": "19h30 às 23h00",
      "description": "Uma das experiências mais raras dos Lençóis Maranhenses: observar o céu estrelado sobre as dunas brancas, longe de qualquer poluição luminosa. Um espetáculo astronômico inesquecível.",
      "itinerary": [
        "Saída da agência às 19h30 em 4x4 com iluminação especial",
        "Travessia noturna guiada pelas trilhas dos Lençóis",
        "Chegada ao ponto de observação nas dunas",
        "Contemplação do céu estrelado — Via Láctea visível a olho nu",
        "Guia aponta as constelações e conta histórias do lugar",
        "Retorno a Barreirinhas por volta das 23h00"
      ],
      "whatToBring": [
        "Agasalho (noite pode ser fresca)",
        "Câmera com modo noturno",
        "Água",
        "Repelente",
        "Tapete ou cadeira de praia",
        "Lanterna de cabeça"
      ]
    },
    "quadriciclo": {
      "title": "Passeio de Quadriciclo",
      "tag": "Off-road",
      "schedule": "9h00 às 17h00",
      "description": "Aventura off-road pelas dunas e lagoas pilotando seu próprio quadriciclo. Embarque dupla no veículo, roteiro guiado.",
      "itinerary": [
        "Saída da agência em Barreirinhas por volta das 9h",
        "Instruções de pilotagem e segurança",
        "Trilha off-road pelas dunas e lagoas",
        "Paradas em lagoas para banho e fotos",
        "Almoço em roteiro (não incluso)",
        "Retorno a Barreirinhas por volta das 17h"
      ],
      "whatToBring": [
        "Protetor solar",
        "Roupa de banho",
        "Toalha",
        "Água",
        "Chapéu/boné",
        "Óculos de sol",
        "Dinheiro para almoço",
        "Documentos para o contrato"
      ],
      "note": "Veículo para 2 pessoas em grupo"
    }
  },
  "en": {
    "lagoa-azul": {
      "title": "Lagoa Azul Circuit",
      "tag": "Most popular",
      "schedule": "9am to 1pm",
      "description": "4x4 crossing to the most famous lagoons, swimming in the green waters and walking on the dunes. The Lençóis classic.",
      "itinerary": [
        "Departure from the agency in Barreirinhas by 4x4 around 9am",
        "Crossing of about 40 min to the Lençóis gateway",
        "Walk on the dunes to Lagoa do Peixe and Lagoa Azul",
        "Free time for swimming and photos at the lagoons",
        "Stop at additional lagoons according to the day's itinerary",
        "Return to Barreirinhas around 1pm"
      ],
      "whatToBring": [
        "Sunscreen",
        "Swimwear",
        "Towel",
        "Water",
        "Hat/cap",
        "Sunglasses",
        "Cash for extras"
      ]
    },
    "lagoa-bonita": {
      "title": "Lagoa Bonita Circuit",
      "tag": "Golden Hour",
      "schedule": "Departure 2pm with sunset",
      "description": "Late afternoon departure to enjoy the golden spectacle over Lagoa Bonita. Perfect light for photos and a light walk.",
      "itinerary": [
        "Departure from the agency in Barreirinhas around 2pm",
        "4x4 crossing to the base of Lagoa Bonita",
        "Guided walk of approximately 20 min to the lagoon",
        "Free time for swimming and contemplation",
        "Climb to the viewpoint for panoramic sunset",
        "Return to Barreirinhas after dusk"
      ],
      "whatToBring": [
        "Sunscreen",
        "Swimwear",
        "Towel",
        "Water",
        "Hat/cap",
        "Camera/camcorder",
        "Repellent",
        "Flashlight for return"
      ]
    },
    "duas-lagoas": {
      "title": "Two Lagoons — Azul & Bonita",
      "tag": "Full day",
      "schedule": "Departure 9am with sunset",
      "description": "The most complete itinerary: Lagoa Azul in the morning and Lagoa Bonita in the afternoon, ending with sunset on the dunes.",
      "itinerary": [
        "Departure from the agency in Barreirinhas around 9am",
        "Morning: Lagoa Azul Circuit with swimming and walking",
        "Free lunch in Barreirinhas (not included)",
        "Afternoon: departure to Lagoa Bonita",
        "Sunset at the Lagoa Bonita viewpoint",
        "Return to Barreirinhas after dusk"
      ],
      "whatToBring": [
        "Sunscreen",
        "Swimwear",
        "Towel",
        "Water (2L)",
        "Snack for the day",
        "Hat/cap",
        "Camera",
        "Repellent",
        "Flashlight"
      ]
    },
    "atins": {
      "title": "Atins Circuit",
      "tag": "Adventure",
      "schedule": "9am to 5pm",
      "description": "Descent to Atins, deserted beaches and hidden lagoons between coastal dunes. A full day of exploration.",
      "itinerary": [
        "Departure from the agency in Barreirinhas around 9am",
        "4x4 crossing to the village of Atins",
        "Walk on coastal dunes and hidden lagoons",
        "Visit to deserted beaches on the coast",
        "Typical lunch in Atins (not included)",
        "Return to Barreirinhas around 5pm"
      ],
      "whatToBring": [
        "Sunscreen",
        "Swimwear",
        "Towel",
        "Water (2L)",
        "Snack",
        "Hat/cap",
        "Camera",
        "Cash for lunch"
      ]
    },
    "rio-preguicas-cabure": {
      "title": "Preguiças River & Caburé Circuit",
      "tag": "Riverside",
      "schedule": "8:30am to 3:30pm",
      "description": "Speedboat ride along the Preguiças River to Caburé — where the river meets the sea. Meeting of waters and coastal dunes.",
      "itinerary": [
        "Boarding at the Barreirinhas port around 8:30am",
        "Navigation along the Preguiças River by speedboat",
        "Stop at Vassouras (small riverside dunes)",
        "Continuation to the river mouth at Caburé",
        "Free time at the beach and the river/sea meeting",
        "Lunch in Caburé (not included) and return at 3:30pm"
      ],
      "whatToBring": [
        "Sunscreen",
        "Swimwear",
        "Towel",
        "Water",
        "Hat/cap",
        "Camera",
        "Cash for lunch",
        "Repellent"
      ]
    },
    "boia-cross": {
      "title": "Boia Cross",
      "tag": "Fun",
      "schedule": "8:30am to 1:00pm",
      "description": "Descent down the Preguiças River on individual floats, with gentle rapids and riverside scenery. A water adventure for everyone.",
      "itinerary": [
        "Departure from the agency in Barreirinhas around 8:30am",
        "4x4 crossing to the river boarding point",
        "Descent down the Preguiças River on individual floats",
        "Stops at river beaches and gentle rapids",
        "Swimming and rest time along the route",
        "Return to Barreirinhas around 1pm"
      ],
      "whatToBring": [
        "Sunscreen",
        "Swimwear",
        "Towel",
        "Water",
        "Flip-flops/water shoes",
        "Repellent",
        "Light clothes for return"
      ]
    },
    "nascer-do-sol": {
      "title": "Sunrise on the Dunes",
      "tag": "Exclusive",
      "schedule": "4:30am to 7:00am",
      "description": "Experience the magic of the Lençóis Maranhenses at dawn. The silence of the dunes, the first rays of golden light over the lagoons and a spectacle that very few visitors have the privilege to see.",
      "itinerary": [
        "Departure from the agency at 4:30am by 4x4",
        "Night crossing on the Lençóis trails with an experienced guide",
        "Arrival at the panoramic point before sunrise",
        "Contemplation of dawn over the white dunes and lagoons",
        "Photographic records with the golden light of the first rays",
        "Return to Barreirinhas around 7:00am"
      ],
      "whatToBring": [
        "Light jacket (cold dawn on the dunes)",
        "Camera/phone with full battery",
        "Water",
        "Flashlight",
        "Closed shoes",
        "Repellent"
      ]
    },
    "mirar-das-estrelas": {
      "title": "Stargazing",
      "tag": "Night",
      "schedule": "7:30pm to 11:00pm",
      "description": "One of the rarest experiences in the Lençóis Maranhenses: observing the starry sky over the white dunes, far from any light pollution. An unforgettable astronomical spectacle.",
      "itinerary": [
        "Departure from the agency at 7:30pm by 4x4 with special lighting",
        "Guided night crossing on the Lençóis trails",
        "Arrival at the observation point on the dunes",
        "Contemplation of the starry sky — Milky Way visible to the naked eye",
        "Guide points out constellations and tells stories of the place",
        "Return to Barreirinhas around 11:00pm"
      ],
      "whatToBring": [
        "Jacket (night can be cool)",
        "Camera with night mode",
        "Water",
        "Repellent",
        "Rug or beach chair",
        "Headlamp"
      ]
    },
    "quadriciclo": {
      "title": "ATV / Quad Bike Tour",
      "tag": "Off-road",
      "schedule": "9:00am to 5:00pm",
      "description": "Off-road adventure on the dunes and lagoons riding your own ATV. Double ride on the vehicle, guided itinerary.",
      "itinerary": [
        "Departure from the agency in Barreirinhas around 9am",
        "Riding and safety instructions",
        "Off-road trail on the dunes and lagoons",
        "Stops at lagoons for swimming and photos",
        "Lunch on the route (not included)",
        "Return to Barreirinhas around 5pm"
      ],
      "whatToBring": [
        "Sunscreen",
        "Swimwear",
        "Towel",
        "Water",
        "Hat/cap",
        "Sunglasses",
        "Cash for lunch",
        "Documents for the contract"
      ],
      "note": "Vehicle for 2 people in a group"
    }
  },
  "es": {
    "lagoa-azul": {
      "title": "Circuito Laguna Azul",
      "tag": "Más solicitado",
      "schedule": "9h a 13h",
      "description": "Cruce en 4x4 hasta las lagunas más famosas, baño en las aguas verdes y caminata por las dunas. El clásico de los Lençóis.",
      "itinerary": [
        "Salida de la agencia en Barreirinhas en 4x4 alrededor de las 9h",
        "Cruce de unos 40 min hasta el portal de los Lençóis",
        "Caminata por las dunas hasta la Laguna do Peixe y Laguna Azul",
        "Tiempo libre para baño y fotos en las lagunas",
        "Parada en lagunas adicionales según el itinerario del día",
        "Regreso a Barreirinhas alrededor de las 13h"
      ],
      "whatToBring": [
        "Protector solar",
        "Ropa de baño",
        "Toalla",
        "Agua",
        "Sombrero/gorra",
        "Gafas de sol",
        "Dinero para extras"
      ]
    },
    "lagoa-bonita": {
      "title": "Circuito Laguna Bonita",
      "tag": "Golden Hour",
      "schedule": "Salida 14h con atardecer",
      "description": "Salida a finales de la tarde para disfrutar del espectáculo dorado sobre la Laguna Bonita. Luz perfecta para fotos y caminata ligera.",
      "itinerary": [
        "Salida de la agencia en Barreirinhas alrededor de las 14h",
        "Cruce en 4x4 hasta la base de la Laguna Bonita",
        "Caminata guiada de aproximadamente 20 min hasta la laguna",
        "Tiempo libre para baño y contemplación",
        "Subida al mirador para el atardecer panorámico",
        "Regreso a Barreirinhas después del anochecer"
      ],
      "whatToBring": [
        "Protector solar",
        "Ropa de baño",
        "Toalla",
        "Agua",
        "Sombrero/gorra",
        "Cámara/videocámara",
        "Repelente",
        "Linterna para el regreso"
      ]
    },
    "duas-lagoas": {
      "title": "Dos Lagunas — Azul y Bonita",
      "tag": "Día completo",
      "schedule": "Salida 9h con atardecer",
      "description": "El itinerario más completo: Laguna Azul por la mañana y Laguna Bonita por la tarde, cerrando con el atardecer en las dunas.",
      "itinerary": [
        "Salida de la agencia en Barreirinhas alrededor de las 9h",
        "Mañana: Circuito Laguna Azul con baño y caminata",
        "Almuerzo libre en Barreirinhas (no incluido)",
        "Tarde: salida a la Laguna Bonita",
        "Atardecer en el mirador de la Laguna Bonita",
        "Regreso a Barreirinhas después del anochecer"
      ],
      "whatToBring": [
        "Protector solar",
        "Ropa de baño",
        "Toalla",
        "Agua (2L)",
        "Snack para el día",
        "Sombrero/gorra",
        "Cámara",
        "Repelente",
        "Linterna"
      ]
    },
    "atins": {
      "title": "Circuito Atins",
      "tag": "Aventura",
      "schedule": "9h a 17h",
      "description": "Bajada hasta Atins, playas desiertas y lagunas escondidas entre dunas costeras. Día entero de exploración.",
      "itinerary": [
        "Salida de la agencia en Barreirinhas alrededor de las 9h",
        "Cruce en 4x4 hasta la aldea de Atins",
        "Caminata por las dunas costeras y lagunas escondidas",
        "Visita a las playas desiertas de la costa",
        "Almuerzo típico en Atins (no incluido)",
        "Regreso a Barreirinhas alrededor de las 17h"
      ],
      "whatToBring": [
        "Protector solar",
        "Ropa de baño",
        "Toalla",
        "Agua (2L)",
        "Snack",
        "Sombrero/gorra",
        "Cámara",
        "Dinero para almuerzo"
      ]
    },
    "rio-preguicas-cabure": {
      "title": "Circuito Río Preguiça & Caburé",
      "tag": "Ribereño",
      "schedule": "8h30 a 15h30",
      "description": "Paseo en lancha rápida por el Río Preguiças hasta Caburé — donde el río se encuentra con el mar. Encuentro de aguas y dunas costeras.",
      "itinerary": [
        "Embarque en el puerto de Barreirinhas alrededor de las 8h30",
        "Navegación por el Río Preguiças en lancha rápida",
        "Parada en Vassouras (pequeños lençóis ribereños)",
        "Continuación hasta la desembocadura del río en Caburé",
        "Tiempo libre en la playa y en el encuentro río/mar",
        "Almuerzo en Caburé (no incluido) y regreso a las 15h30"
      ],
      "whatToBring": [
        "Protector solar",
        "Ropa de baño",
        "Toalla",
        "Agua",
        "Sombrero/gorra",
        "Cámara",
        "Dinero para almuerzo",
        "Repelente"
      ]
    },
    "boia-cross": {
      "title": "Boia Cross",
      "tag": "Diversión",
      "schedule": "8h30 a 13h00",
      "description": "Descenso por el Río Preguiças en flotadores individuales, con rápidos suaves y paisajes ribereños. Aventura acuática para todos.",
      "itinerary": [
        "Salida de la agencia en Barreirinhas alrededor de las 8h30",
        "Cruce en 4x4 hasta el punto de embarque en el río",
        "Descenso por el Río Preguiças en flotadores individuales",
        "Paradas en playas fluviales y rápidos suaves",
        "Tiempo de natación y descanso en el recorrido",
        "Regreso a Barreirinhas alrededor de las 13h"
      ],
      "whatToBring": [
        "Protector solar",
        "Ropa de baño",
        "Toalla",
        "Agua",
        "Chanclas/calzado acuático",
        "Repelente",
        "Ropa ligera para el regreso"
      ]
    },
    "nascer-do-sol": {
      "title": "Amanecer en las Dunas",
      "tag": "Exclusivo",
      "schedule": "4h30 a 7h00",
      "description": "Experimenta la magia de los Lençóis Maranhenses al amanecer. El silencio de las dunas, los primeros rayos de luz dorada sobre las lagunas y un espectáculo que muy pocos visitantes tienen el privilegio de ver.",
      "itinerary": [
        "Salida de la agencia a las 4h30 de la mañana en 4x4",
        "Cruce nocturno por los senderos de los Lençóis con guía experimentado",
        "Llegada al punto panorámico antes del amanecer",
        "Contemplación del amanecer sobre las dunas blancas y lagunas",
        "Registros fotográficos con la luz dorada de los primeros rayos",
        "Regreso a Barreirinhas alrededor de las 7h00"
      ],
      "whatToBring": [
        "Chaqueta ligera (madrugada fría en las dunas)",
        "Cámara/teléfono con batería llena",
        "Agua",
        "Linterna",
        "Calzado cerrado",
        "Repelente"
      ]
    },
    "mirar-das-estrelas": {
      "title": "Observación de Estrellas",
      "tag": "Nocturno",
      "schedule": "19h30 a 23h00",
      "description": "Una de las experiencias más raras de los Lençóis Maranhenses: observar el cielo estrellado sobre las dunas blancas, lejos de cualquier contaminación lumínica. Un espectáculo astronómico inolvidable.",
      "itinerary": [
        "Salida de la agencia a las 19h30 en 4x4 con iluminación especial",
        "Cruce nocturno guiado por los senderos de los Lençóis",
        "Llegada al punto de observación en las dunas",
        "Contemplación del cielo estrellado — Vía Láctea visible a simple vista",
        "El guía señala las constelaciones y cuenta historias del lugar",
        "Regreso a Barreirinhas alrededor de las 23h00"
      ],
      "whatToBring": [
        "Chaqueta (la noche puede ser fresca)",
        "Cámara con modo nocturno",
        "Agua",
        "Repelente",
        "Alfombra o silla de playa",
        "Linterna frontal"
      ]
    },
    "quadriciclo": {
      "title": "Paseo en Cuatrimoto",
      "tag": "Off-road",
      "schedule": "9h00 a 17h00",
      "description": "Aventura off-road por las dunas y lagunas conduciendo tu propio cuatrimoto. Embarque doble en el vehículo, itinerario guiado.",
      "itinerary": [
        "Salida de la agencia en Barreirinhas alrededor de las 9h",
        "Instrucciones de conducción y seguridad",
        "Sendero off-road por las dunas y lagunas",
        "Paradas en lagunas para baño y fotos",
        "Almuerzo en el recorrido (no incluido)",
        "Regreso a Barreirinhas alrededor de las 17h"
      ],
      "whatToBring": [
        "Protector solar",
        "Ropa de baño",
        "Toalla",
        "Agua",
        "Sombrero/gorra",
        "Gafas de sol",
        "Dinero para almuerzo",
        "Documentos para el contrato"
      ],
      "note": "Vehículo para 2 personas en grupo"
    }
  }
};
