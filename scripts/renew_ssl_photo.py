#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""摄影站 www.dlidex.work SSL 证书换新脚本（复刻 2026-10-09 主站成功流程）
用法:
  python3 renew_ssl_photo.py apply    # 第1步: 占用免费实例 -> 填域名 -> 提交签发申请, 打印 DNS TXT 记录
  python3 renew_ssl_photo.py status   # 第2步: 查看签发进度 / DNS 验证记录
  python3 renew_ssl_photo.py deploy <cert_id>  # 第3步: 拿证书+私钥, 以 upload 方式部署到 CDN www.dlidex.work
"""
import sys, os, json, time

AK_FILE = "~/Documents/阿里云密钥.txt"
DOMAIN = "www.dlidex.work"
CDN_DOMAIN = "www.dlidex.work"
CONTACT_ID = 1409362          # 主站换证时确认的联系人 ID
PRODUCT_CODE = "digicert-free-1-free"


def creds():
    txt = open(AK_FILE, encoding="utf-8").read()
    ids = [k for k in txt.replace("=", " ").replace("：", " ").split()]
    # 兼容两种写法: AccessKey ID / AccessKey Secret
    ak = sk = None
    lines = txt.splitlines()
    for line in lines:
        if ("AccessKey" in line or "access_key" in line.lower()) and "ID" in line.upper() and sk is None and ak is None:
            parts = line.replace("=", " ").replace("：", " ").split()
            nums = [p for p in parts if len(p) >= 16 and p not in ("AccessKey", "ID")]
            if nums:
                ak = nums[0]
        elif ("Secret" in line or "secret" in line.lower()) and sk is None:
            parts = line.replace("=", " ").replace("：", " ").split()
            nums = [p for p in parts if len(p) >= 16 and p not in ("Secret",)]
            if nums:
                sk = nums[-1]
    if not ak or not sk:
        # fallback: 取全文中最像 LTAI 的和最后一段长随机串
        tokens = txt.replace("=", " ").replace("：", " ").replace(",", " ").split()
        for t in tokens:
            if t.startswith("LTAI"):
                ak = t
        cand = [t for t in tokens if len(t) >= 25 and not t.startswith("LTAI")]
        if cand:
            sk = cand[-1]
    if not ak or not sk:
        raise SystemExit("无法从密钥文件解析 AK/SK")
    return ak, sk


def cas_client(ak, sk):
    from alibabacloud_cas20200407.client import Client
    from alibabacloud_tea_openapi import models as open_api_models
    config = open_api_models.Config(access_key_id=ak, access_key_secret=sk, endpoint="cas.aliyuncs.com")
    return Client(config)


def dns_client(ak, sk):
    from alibabacloud_alidns20150109.client import Client
    from alibabacloud_tea_openapi import models as open_api_models
    config = open_api_models.Config(access_key_id=ak, access_key_secret=sk, endpoint="alidns.aliyuncs.com")
    return Client(config)


def find_instance(client):
    """找未使用的(待申请)免费证书实例"""
    from alibabacloud_cas20200407 import models as cas_models
    req = cas_models.ListInstancesRequest(current_page=1, show_size=50)
    resp = client.list_instances(req)
    items = resp.body.instance_list or []
    for it in items:
        # 找还没有绑定域名/没有证书的实例
        if not (it.domain or ""):
            print(f"候选实例: {it.instance_id} type={it.instance_type} product={getattr(it, 'product_code', '?')}")
    return [it.instance_id for it in items if not (it.domain or "")]


def do_apply():
    ak, sk = creds()
    client = cas_client(ak, sk)
    from alibabacloud_cas20200407 import models as cas_models

    free = find_instance(client)
    if not free:
        raise SystemExit("没有可用的免费证书实例（待申请=0），请先在控制台申领免费额度")
    inst = free[0]
    print(f"使用实例: {inst}")

    # 1) 实例填入域名+联系人
    up = cas_models.UpdateInstanceRequest(instance_id=inst, domain=DOMAIN, contact_id_list=[CONTACT_ID])
    client.update_instance(up)
    print(f"实例 {inst} 已填入域名 {DOMAIN}")

    # 2) 提交签发申请
    ap = cas_models.ApplyCertificateRequest(instance_id=inst)
    r = client.apply_certificate(ap)
    print("apply_certificate 返回:", r.body)

    # 3) 取 DNS 验证记录
    time.sleep(3)
    detail = client.get_instance_detail(cas_models.GetInstanceDetailRequest(instance_id=inst))
    dv = detail.body.domain_validation_list or []
    print("\n=== DNS 验证记录（若下面为空请用 status 命令再查）===")
    for d in dv:
        print(json.dumps({"host": getattr(d, "record_host", None) or getattr(d, "domain", None),
                          "type": getattr(d, "record_type", None),
                          "value": getattr(d, "record_value", None)}, ensure_ascii=False))


def do_status():
    ak, sk = creds()
    client = cas_client(ak, sk)
    from alibabacloud_cas20200407 import models as cas_models
    req = cas_models.ListInstancesRequest(current_page=1, show_size=50)
    items = client.list_instances(req).body.instance_list or []
    for it in items:
        if DOMAIN in (it.domain or ""):
            print(f"实例 {it.instance_id} 域名={it.domain} 状态={it.status}/{it.certificate_status} type={it.instance_type}")
            detail = client.get_instance_detail(cas_models.GetInstanceDetailRequest(instance_id=it.instance_id))
            print("  certificate_order_id:", getattr(detail.body, "certificate_order_id", None))
            dv = detail.body.domain_validation_list or []
            for d in dv:
                print("  DNS验证:", {"host": getattr(d, "record_host", None), "type": getattr(d, "record_type", None),
                                     "value": getattr(d, "record_value", None), "state": getattr(d, "state", None)})

    # 已签发的证书列表里找新证
    lr = client.list_user_certificate_order(cas_models.ListUserCertificateOrderRequest(
        current_page=1, show_size=20, order_type="CERT"))
    for c in (lr.body.certificate_order_list or []):
        name = getattr(c, "common_name", "") or ""
        sans = getattr(c, "sans", None)
        if DOMAIN in name or (sans and DOMAIN in str(sans)):
            print(f"证书 cert_id={c.certificate_id} 名称={getattr(c,'name',None)} 状态={getattr(c,'status',None)} "
                  f"签发={getattr(c,'start_time',None)} 到期={getattr(c,'expire_time',None)}")


def do_deploy(cert_id):
    ak, sk = creds()
    client = cas_client(ak, sk)
    from alibabacloud_cas20200407 import models as cas_models

    det = client.get_user_certificate_detail(cas_models.GetUserCertificateDetailRequest(certificate_id=int(cert_id)))
    b = det.body
    cert_pem = getattr(b, "cert", None)
    key_pem = getattr(b, "key", None)
    if not cert_pem or not key_pem:
        raise SystemExit("拿不到 Cert/Key（证书可能未签发完成）")
    print(f"已取到证书: {getattr(b, 'common_name', '')} 有效期 {getattr(b,'start_time','')} ~ {getattr(b,'expire_time','')}")
    print(f"证书PEM长度={len(cert_pem)} 私钥PEM长度={len(key_pem)}")

    from alibabacloud_cdn20180510.client import Client as CdnClient
    from alibabacloud_tea_openapi import models as open_api_models
    cdn = CdnClient(open_api_models.Config(access_key_id=ak, access_key_secret=sk, endpoint="cdn.aliyuncs.com"))
    from alibabacloud_cdn20180510 import models as cdn_models
    name = f"dlidex-work-2026-10-09"
    req = cdn_models.SetCdnDomainSSLCertificateRequest(
        domain_name=CDN_DOMAIN, cert_name=name, cert_type="upload",
        sslpub=cert_pem, sslpri=key_pem, sslprotocol="on")
    r = cdn.set_cdn_domain_sslcertificate(req)
    print("CDN 部署返回:", r.body)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    if cmd == "apply":
        do_apply()
    elif cmd == "status":
        do_status()
    elif cmd == "deploy":
        do_deploy(sys.argv[2])
    else:
        print(__doc__)
