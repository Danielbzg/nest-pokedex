import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
;

@Injectable()
export class SeedService {
  
  

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ){}
  
  async executeSeed() {

    //Forma de hacerlo 1
    await this.pokemonModel.deleteMany({}); //Borramos todos los pokemons

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const PokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      
      const segments = url.split('/');
      const no: number = +segments[ segments.length -2 ];

      // const pokemon = await this.pokemonModel.create( { name, no } );
      PokemonToInsert.push({ name, no }); //
    });

    await this.pokemonModel.insertMany(PokemonToInsert);

    return 'Seed Executed';

    /*//Forma de hacerlo 2
    await this.pokemonModel.deleteMany({}); //Borramos todos los pokemons

    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

    const insertPromisesArray = [];

    data.results.forEach(({ name, url }) => {
      
      const segments = url.split('/');
      const no: number = +segments[ segments.length -2 ];

      // const pokemon = await this.pokemonModel.create( { name, no } );
      insertPromisesArray.push(
       this.pokemonModel.create( { name, no })
      );
    });

    await Promise.all( insertPromisesArray );

    return 'Seed Executed';*/


  }

}
