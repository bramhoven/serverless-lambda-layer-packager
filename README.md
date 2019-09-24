# Serverless Lambda Layer Packager
This [Serverless](https://serverless.com) plugin allows you to maintain your normal project structure when developing your Lambda Layer, and you do not have to think about it getting packaged in the correct folder.

Let's say you are making a Python Lambda function with a Python layer, that layer's code will have to be put inside a `python/{packagename}` folder inside your layer's zip file. This `python` folder clutters up your workspace and with this plugin, you do not have to think about it. It will put your code inside the correct folder when `Serverless` packages your layer.

## Documentation
- [Installation](#installation)
- [Configuration](#configuration)

## Installation
First, add Serverless Lambda Layer Packager to your project:

`npm install serverless-lambda-layer-packager`

Then inside your project's `serverless.yml` file add the following entry to the plugins section: `serverless-lambda-layer-packager`. If there is no plugin section you will need to add it to the file.

It should look something like this:
```yml
plugins:
  - serverless-lambda-layer-packager
```

You can check wether you have successfully installed the plugin by running the serverless command line:

`serverless --help`

The console should display `ServerlessLambdaLayerPackager` as one of the plugins now available in your Serverless project.

## Configuration
Inside your `serverless.yml` file you can specify what folder the plugin has to use for your layer. You can also specify what runtime it has to use, to be able to get the correct files. You can find more about the folders in the [AWS Layer configuration documentation](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html)

We currently support Python and Node.js runtimes and these are the folder examples:
```
Python: python/{packagename}
Node.js: nodejs/node_modules/{packagename}
```

To configure this in the `serverless.yml` you can add it under `custom`. For example:
```yml
custom:
  serverless-lambda-layer-packager:
    pathPrefix: python/my-layer
    runtime: python3.7
```