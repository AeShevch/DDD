'use strict';

const crudToHttpMethod = {
  create: 'POST',
  read: 'GET',
  update: 'PUT',
  delete: 'DELETE',
  find: 'GET',
}

const buildWSApiMethod = (socket, serviceName, methodName) => (...args) => new Promise((resolve) => {
  const packet = {name: serviceName, method: methodName, args};
  socket.send(JSON.stringify(packet));
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    resolve(data);
  };
});

const buildHttpApiMethod = (url, serviceName, methodName) => async (...args) => {
  let endPoint = `${url}${serviceName}/${methodName}`;
  let body = {};

  args.forEach((arg) => {
    if (arg !== null && typeof arg === 'object') {
      body = {
        ...body,
        ...arg
      }
    } else {
      endPoint = `${endPoint}/${arg}`
    }
  });

  const response = await fetch(endPoint, {
    method: crudToHttpMethod[methodName],
    body: Object.values(body).length ? JSON.stringify(body) : undefined,
    'Content-Type': 'application/json',
  });

  return response.json();
}


const scaffoldWs = (url, structure) => {
  const socket = new WebSocket(url);
  const api = {};
  const services = Object.keys(structure);

  for (const serviceName of services) {
    api[serviceName] = {};
    const service = structure[serviceName];
    const methods = Object.keys(service);
    for (const methodName of methods) {
      api[serviceName][methodName] = buildWSApiMethod(socket, serviceName, methodName)
    }
  }
  return api;
};

const scaffoldHttp = (url, structure) => {
  const api = {};
  const services = Object.keys(structure);

  for (const serviceName of services) {
    api[serviceName] = {};
    const service = structure[serviceName];
    const methods = Object.keys(service);
    for (const methodName of methods) {
      api[serviceName][methodName] = buildHttpApiMethod(url, serviceName, methodName);
    }
  }
  return api;
};


const buildApi = (url, structure) => {
  const protocol = url.substring(0, url.indexOf(':'));

  switch (protocol) {
    case 'ws':
      return scaffoldWs(url, structure)
    case 'http':
      return scaffoldHttp(url, structure)

    default:
      throw new Error(`Unknown protocol - ${protocol}`);
  }
};

const api = buildApi('http://127.0.0.1:8001/', {
  user: {
    create: ['record'],
    read: ['id'],
    update: ['id', 'record'],
    delete: ['id'],
    find: ['mask'],
  },
  country: {
    read: ['id'],
    delete: ['id'],
    find: ['mask'],
  },
});
