module.exports = {
  webpack:(config)=>{
    config.output.library = 'slave-react';  
    config.output.libraryTarget = 'umd';
    config.output.publicPath = '//localhost:30000/';
    return config;
  },
  devServer:(config)=>{
    config.headers = {
      'Access-Control-Allow-Origin': '*'
    };

    return config;
  }
}