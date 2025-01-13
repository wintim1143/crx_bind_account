(async function dosome($x, times = -1) {
  if (!times) return;

  async function delay(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  await delay(1000);

  function get() {
  	const ysxItems = $x('//*/span[text()="已失效"]/ancestor::div[contains(@class, "notification-title-unread")]/ancestor::div[@class="table-td-ceil"]');
  	if (ysxItems.length) {
  	  return { 
  	    items: ysxItems, 
  	    async handle() { },
  	  };
  	}

    const dqrItems = $x('//*/span[text()="待确认"]/ancestor::div[contains(@class, "notification-title-unread")]/ancestor::div[@class="table-td-ceil"]');
    if (dqrItems.length) {
  	  return { 
  	    items: dqrItems, 
  	    async handle() { 
          await delay(100);
          $x('//*/span[text()="《巨量引擎工作台账户管理服务协议》"]/ancestor::div[@class="byted-checkbox"]//*/div[@class="bui-checkbox-input-wrapper"]')[0].click();
          
          await delay(100);
          $x('//*/button[normalize-space(text())="同意"]')[0].click();
          
          while (!$x('//*/button[normalize-space(text())="已同意"]').length) {
            await delay(500);
          }
  	    },
  	  };
  	}

  	return { 
  	  items: [], 
  	  async handle() { },
  	};
  }

  const info = get();
  
  if (info.items.length) {
    await delay(100);
    info.items[0].click();

    await info.handle();
  
    await delay(100);
    $x('//*/div[@class="drawer-close"]')[0].click();
  } else {
    await delay(100);
    const nextItems = $x('//*/div[contains(@class, "notification-pagination")]//*/a[text()="2"]');
    if (!nextItems.length) return;

    await delay(100);
    nextItems[0].click();

    await delay(500);
    $x('//*/div[contains(@class, "notification-pagination")]//*/a[text()="1"]')[0].click();
  }

  await dosome($x, Math.max(-1, times - 1));
  
})($x)