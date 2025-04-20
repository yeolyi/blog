const obj = {
  // biome-ignore lint/suspicious/noThenProperty: <explanation>
  then(resolve, reject) {
    resolve('hello');
  },
};

async function test() {
  const res = await obj;
  console.log(res);
}

test();
